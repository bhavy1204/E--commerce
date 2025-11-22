import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, ShoppingCart, LogOut, LayoutDashboard } from "lucide-react";
// import logo from "../../assets/Untitled design.png";
import logo from "../../assets/L5.jpg"
import { useAuth, useCart } from "../../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleLogout = async () => {
        await logout();
        navigate("/home");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <nav className="flex bg-purple-500 px-4 md:px-5 py-3 justify-between gap-4 md:gap-12 items-center flex-wrap">
            <Link to="/home" className="logo text-white font-bold text-xl md:text-2xl flex items-center gap-1">
                <img src={logo} alt="" className="h-8 w-8 rounded-2xl" />
                <h1 className="hidden sm:block">Whimsy Weavers</h1>
            </Link>

            <div className="nav-links hidden md:flex gap-5 text-white font-semibold">
                <Link to="/home" className="hover:text-purple-200">Home</Link>
                <Link to="/contact" className="hover:text-purple-200">Contact</Link>
                <Link to="/products" className="hover:text-purple-200">Products</Link>
                <Link to="/about" className="hover:text-purple-200">About</Link>
            </div>

            <form onSubmit={handleSearch} className="search rounded-2xl bg-gray-300 px-2 py-1 items-center flex-1 max-w-xs">
                <div className="search flex items-center gap-2">
                    <Search className="text-sm" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none flex-1 text-sm"
                    />
                </div>
            </form>

            <div className="user flex items-center gap-3 md:gap-4">
                {user ? (
                    <>
                        <Link
                            to="/cart"
                            className="text-sm text-white flex gap-1 items-center relative"
                        >
                            <ShoppingCart />
                            <span className="hidden sm:inline">Cart</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        {user.role === "admin" && (
                            <Link
                                to="/admin"
                                className="text-sm text-white flex gap-1 items-center"
                            >
                                <LayoutDashboard />
                                <span className="hidden sm:inline">Admin</span>
                            </Link>
                        )}
                        <div className="relative group">
                            <button className="text-sm text-white flex gap-1 items-center">
                                <User />
                                <span className="hidden sm:inline">
                                    {user.firstName} {user.lastName}
                                </span>
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <Link
                                    to="/orders"
                                    className="block px-4 py-2 text-gray-800 hover:bg-purple-100"
                                >
                                    My Orders
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-purple-100 flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="text-sm text-white flex gap-1 items-center"
                        >
                            <User />
                            <span className="hidden sm:inline">Login</span>
                        </Link>
                        <Link
                            to="/signup"
                            className="text-sm text-white bg-purple-700 px-3 py-1 rounded hover:bg-purple-800"
                        >
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}