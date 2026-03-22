import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Calendar, Users, CreditCard, BarChart2 } from "lucide-react";
import { useAuth } from "../context/AuthProvider";

const OwnerLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const pathParts = location.pathname.split("/");
  const activeNav = pathParts[pathParts.length - 1] || "bookings"; // default active → bookings

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Users },
    { id: "finance", label: "Doanh thu", icon: CreditCard },
    { id: "bookings", label: "Sân", icon: Calendar },
    { id: "customers", label: "Khách hàng", icon: Users },
    { id: "settings", label: "Cài đặt", icon: BarChart2 },
  ];

  const getTodayVN = () =>
    new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date());

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-slate-200 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <img
            src={user?.avatar || "https://ui-avatars.com/api/?name=Owner&background=10b981&color=fff"}
            alt="avatar"
            className="w-10 h-10 rounded-full ring-2 ring-emerald-200"
          />
          <div>
            <p className="font-bold text-sm">{user?.name || "Owner"}</p>
            <p className="text-xs text-slate-400">{user?.email || "owner@gmail.com"}</p>
          </div>
        </div>

        <div className="flex-1">
          {navigationItems.map((item) => (
      <Link
        key={item.id}
        to={`/owner/${item.id}`} // ✅ luôn absolute
        className={`w-full text-left flex items-center gap-2 px-4 py-2 rounded-lg mb-1 ${
          activeNav === item.id ? "bg-emerald-500 text-white" : "hover:bg-slate-100"
        }`}
      >
        <item.icon className="w-4 h-4" />
        {item.label}
      </Link>
          ))}
        </div>

        <button
          onClick={logout}
          className="mt-4 w-full px-4 py-2 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 flex items-center justify-center gap-2"
        >
          Đăng xuất
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              {navigationItems.find((n) => n.id === activeNav)?.label || "Owner Dashboard"}
            </h1>
            <p className="text-sm text-slate-500">Chào mừng, {user?.name || "Owner"} 👋</p>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{getTodayVN()}</span>
          </div>
        </div>

        {/* Nội dung route con */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default OwnerLayout;