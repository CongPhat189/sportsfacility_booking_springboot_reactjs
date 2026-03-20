import React, { useState } from "react";
import {
    Users,
    Calendar,
    BarChart2,
    Database,
    Menu,
    X,
    LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthProvider";
import AdminUserManagement from "./AdminUserManagement";
import AdminCategoryManagement from "../pages/AdminCategoryManagement";
import AdminReport from "../pages/AdminReport";
import AdminCourtManagement from "../pages/AdminCourtManagement";

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeNav, setActiveNav] = useState("users");
    const { user, logout } = useAuth();

    const navigationItems = [
        { id: "users", icon: Users, label: "Quản lý người dùng", badge: null },
        { id: "categories", icon: Database, label: "Quản lý danh mục", badge: null },
        { id: "courts", icon: Calendar, label: "Quản lý sân thể thao", badge: null },
        { id: "reports", icon: BarChart2, label: "Báo cáo thống kê", badge: null },
    ];

    const pageTitles = {
        users: "Quản lý người dùng",
        categories: "Quản lý danh mục",
        bookings: "Quản lý sân thể thao",
        reports: "Báo cáo thống kê",
    };

    const getTodayVN = () => {
        return new Intl.DateTimeFormat("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(new Date());
    };

    const NavItem = ({ item, isActive, onClick }) => (
        <button
            onClick={() => onClick(item.id)}
            className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all duration-300 ${isActive
                ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25 scale-[1.02]"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
        >
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isActive ? "bg-white/20" : "bg-slate-100 group-hover:bg-emerald-50"
                    }`}>
                    <item.icon className={`w-4 h-4 transition-all duration-300 ${isActive ? "text-white" : "text-slate-500 group-hover:text-emerald-600"
                        }`} />
                </div>
                <span className="text-sm">{item.label}</span>
            </div>
            {item.badge && (
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${isActive ? "bg-white/25 text-white" : "bg-emerald-100 text-emerald-700"
                    }`}>
                    {item.badge}
                </span>
            )}
        </button>
    );

    return (
        <div className="min-h-screen flex bg-slate-100/50">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                * { font-family: 'Plus Jakarta Sans', sans-serif; }
            `}</style>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Sidebar ──────────────────────────────── */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-slate-100
                    transform transition-all duration-300 ease-out flex flex-col
                    shadow-xl shadow-slate-200/50
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
                style={{ width: 260 }}
            >
                {/* Logo header */}
                <div className="relative overflow-hidden px-5 py-5 bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500">
                    <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10" />
                    <div className="absolute -bottom-6 -left-4 w-20 h-20 rounded-full bg-white/10" />
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <div className="w-7 h-7 rounded-lg bg-white/25 flex items-center justify-center text-sm shadow-sm">
                                    ⚽
                                </div>
                                <h1 className="text-[17px] font-extrabold text-white tracking-tight">
                                    Sport Arena
                                </h1>
                            </div>
                            <p className="text-[11px] text-white/65 font-medium pl-9">Admin Panel</p>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* User profile */}
                <div className="px-4 py-3 border-b border-slate-100">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <img
                            src={
                                user?.avatar ||
                                "https://ui-avatars.com/api/?name=Admin&background=10b981&color=fff&bold=true"
                            }
                            alt="avatar"
                            className="w-10 h-10 rounded-full ring-2 ring-emerald-200 shadow-sm flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">
                                {user?.name || "Admin"}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                                {user?.email || "admin@gmail.com"}
                            </p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white flex-shrink-0" />
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">
                        Điều hướng
                    </p>
                    {navigationItems.map((item) => (
                        <NavItem
                            key={item.id}
                            item={item}
                            isActive={activeNav === item.id}
                            onClick={setActiveNav}
                        />
                    ))}
                </nav>

                {/* Logout */}
                <div className="px-3 pb-4 pt-3 border-t border-slate-100">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group border border-transparent hover:border-red-100"
                    >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-red-100 flex items-center justify-center transition-colors flex-shrink-0">
                            <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-500 transition-colors" />
                        </div>
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* ── Main content ─────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Topbar */}
                <header className="bg-white border-b border-slate-100 px-6 py-3.5 shadow-sm flex-shrink-0">
                    <div className="flex items-center justify-between">
                        {/* Left */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                <Menu className="w-5 h-5 text-slate-600" />
                            </button>
                            <div>
                                <h2 className="text-base font-extrabold text-slate-800 leading-tight">
                                    Sport Arena Admin Dashboard
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Chào mừng trở lại,{" "}
                                    <span className="text-emerald-600 font-semibold">
                                        {user?.name || "Admin"}
                                    </span>{" "}
                                    👋
                                </p>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-2">


                            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-xs font-semibold px-3 py-2 rounded-xl">
                                <Calendar style={{ width: 12, height: 12 }} />
                                {getTodayVN()}
                            </div>
                        </div>
                    </div>

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[11px] text-slate-400">Dashboard</span>
                        <span className="text-[11px] text-slate-300">/</span>
                        <span className="text-[11px] font-semibold text-emerald-600">
                            {pageTitles[activeNav]}
                        </span>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        {activeNav === "users" && <AdminUserManagement />}
                        {activeNav === "categories" && <AdminCategoryManagement />}
                        {activeNav === "courts" && <AdminCourtManagement />}
                        {activeNav === "reports" && <AdminReport />}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;