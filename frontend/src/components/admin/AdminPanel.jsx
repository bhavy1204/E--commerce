import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AdminDashboard } from './AdminDashboard';
import { AdminProductForm } from './AdminProductForm';
import { AdminOrders } from './AdminOrders';
import { AdminOrderDetail } from './AdminOrderDetail';
import { AdminContentManager } from './AdminContentManager';
import { AdminCoupons } from './AdminCoupons';
import { LayoutDashboard, Package, ShoppingBag, FileText, Tag } from 'lucide-react';

export const AdminPanel = () => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex flex-col lg:flex-row">

                {/* Sidebar */}
                <aside className="w-full lg:w-64 bg-purple-600 min-h-screen p-6">
                    <h2 className="text-2xl font-bold text-white mb-8">Admin Panel</h2>

                    <nav className="space-y-2">
                        <Link
                            to="/admin"
                            className={`flex items-center gap-3 text-white hover:bg-purple-700 px-4 py-2 rounded-md ${location.pathname === '/admin' ? 'bg-purple-700' : ''
                                }`}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Dashboard
                        </Link>

                        <Link
                            to="/admin/products/new"
                            className={`flex items-center gap-3 text-white hover:bg-purple-700 px-4 py-2 rounded-md ${location.pathname === '/admin/products/new' ? 'bg-purple-700' : ''
                                }`}
                        >
                            <Package className="w-5 h-5" />
                            Add Product
                        </Link>

                        <Link
                            to="/admin/orders"
                            className={`flex items-center gap-3 text-white hover:bg-purple-700 px-4 py-2 rounded-md ${location.pathname.startsWith('/admin/orders') ? 'bg-purple-700' : ''
                                }`}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Orders
                        </Link>

                        <Link
                            to="/admin/content"
                            className={`flex items-center gap-3 text-white hover:bg-purple-700 px-4 py-2 rounded-md ${location.pathname === '/admin/content' ? 'bg-purple-700' : ''
                                }`}
                        >
                            <FileText className="w-5 h-5" />
                            Site Content
                        </Link>

                        <Link
                            to="/admin/coupons"
                            className={`flex items-center gap-3 text-white hover:bg-purple-700 px-4 py-2 rounded-md ${location.pathname === '/admin/coupons' ? 'bg-purple-700' : ''
                                }`}
                        >
                            <Tag className="w-5 h-5" />
                            Coupons
                        </Link>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    <Routes>
                        <Route index element={<AdminDashboard />} />
                        <Route path="products/new" element={<AdminProductForm />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="orders/:orderId" element={<AdminOrderDetail />} />
                        <Route path="content" element={<AdminContentManager />} />
                        <Route path="coupons" element={<AdminCoupons />} />
                    </Routes>
                </main>

            </div>
        </div>
    );
};
