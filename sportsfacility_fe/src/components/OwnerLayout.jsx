import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Calendar, Users, CreditCard, BarChart2, LogOut, Layers, ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthProvider";

const OwnerLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const pathParts = location.pathname.split("/");
  const activeNav = pathParts[pathParts.length - 1] || "courts";

  const navigationItems = [
    // { id: "dashboard", label: "Dashboard", icon: Layers },
    { id: "schedule", label: "Lịch sân", icon: CreditCard },
    { id: "courts", label: "Quản lý sân", icon: Calendar },
    { id: "booking", label: "Đơn hàng", icon: ShoppingCart },
    { id: "revenue", label: "Doanh thu", icon: Users },
    // { id: "settings", label: "Cài đặt", icon: BarChart2 },
  ];

  const getTodayVN = () =>
    new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date());

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* ── SIDEBAR ── */}
      <aside className="w-60 min-h-screen bg-slate-900 flex flex-col px-4 py-7 sticky top-0 shrink-0">

        {/* Profile */}
        <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl px-3 py-3 mb-4">
          <img
            src={
              user?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Owner")}&background=10b981&color=fff`
            }
            alt="avatar"
            className="w-9 h-9 rounded-full border-2 border-emerald-500 object-cover shrink-0"
          />
          <div className="min-w-0">
            <p className="text-slate-100 font-semibold text-sm truncate">{user?.name || "Owner"}</p>
            <p className="text-slate-500 text-xs truncate">{user?.email || "owner@gmail.com"}</p>
          </div>
        </div>

        <div className="border-b border-slate-700/60 mb-5" />

        {/* Nav label */}
        <p className="text-slate-600 text-xs font-semibold uppercase tracking-widest px-2 mb-3">Menu</p>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col gap-1">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              to={`/owner/${item.id}`}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                activeNav === item.id
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-[1.03]"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:scale-[1.03]"
              }`}
            >
              <item.icon
                className={`w-4 h-4 shrink-0 ${activeNav === item.id ? "opacity-100" : "opacity-50"}`}
              />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={logout}
          className="mt-6 flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:scale-[1.03] transition-all w-full"
        >
          <LogOut className="w-4 h-4 opacity-80" />
          Đăng xuất
        </button>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              {navigationItems.find((n) => n.id === activeNav)?.label || "Owner Dashboard"}
            </h1>
            <p className="text-xs text-slate-400">Chào mừng, {user?.name || "Owner"} 👋</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-500 text-sm font-medium">
            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
            {getTodayVN()}
          </div>
        </header>

        {/* Page body */}
        <div className="flex-1 p-8">
          <div className="bg-white rounded-2xl border border-slate-200 min-h-96 overflow-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerLayout; 