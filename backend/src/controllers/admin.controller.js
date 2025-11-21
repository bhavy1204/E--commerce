import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";

export const getDashboardStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments({ role: 'user' });
        
        const totalRevenue = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

        const recentOrders = await Order.find()
            .populate('user', 'firstName lastName email')
            .populate('items.product', 'title images')
            .sort({ createdAt: -1 })
            .limit(10);

        const ordersByStatus = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const topProducts = await Product.find()
            .sort({ views: -1 })
            .limit(10)
            .select('title views images price');

        const monthlyRevenue = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 12 }
        ]);

        return res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalProducts,
                    totalOrders,
                    totalUsers,
                    revenue
                },
                recentOrders,
                ordersByStatus,
                topProducts,
                monthlyRevenue
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error fetching dashboard stats"
        });
    }
};

export const getTrafficStats = async (req, res) => {
    try {
        const { days = 30 } = req.query;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const productViews = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: '$views' },
                    avgViews: { $avg: '$views' }
                }
            }
        ]);

        const viewsByProduct = await Product.find()
            .sort({ views: -1 })
            .limit(20)
            .select('title views images');

        const ordersByDay = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } }
        ]);

        return res.status(200).json({
            success: true,
            data: {
                productViews: productViews[0] || { totalViews: 0, avgViews: 0 },
                viewsByProduct,
                ordersByDay
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error fetching traffic stats"
        });
    }
};

