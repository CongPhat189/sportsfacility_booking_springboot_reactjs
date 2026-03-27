import React, { useState, useEffect } from "react";
import { authAPIs, endpoints } from "../config/APIs";
import { Search } from "lucide-react";

const OwnerBookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");

  // Load bookings
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const res = await authAPIs().get(endpoints["owner-bookings"]);
        console.log("Bookings API response:", res.data);
        setBookings(res.data); // JSON bạn gửi là array
      } catch (err) {
        console.error(
          "Error fetching bookings:",
          err.response?.status,
          err.response?.data || err.message
        );
      }
    };
    loadBookings();
  }, []);

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const customerName = b.customer?.name || "";
    const courtName = b.court?.name || `Sân #${b.courtId}`;
    return (
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      courtName.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Status styles
  const statusStyle = (status) => {
    if (!status) return "bg-slate-100 text-slate-400";
    const s = status.toLowerCase();
    if (s === "pending") return "bg-amber-50 text-amber-600";
    if (s === "confirmed") return "bg-emerald-50 text-emerald-600";
    if (s === "cancelled") return "bg-red-50 text-red-500";
    if (s === "checked_in") return "bg-blue-50 text-blue-600";
    return "bg-slate-100 text-slate-400";
  };

  return (
    <div className="p-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm booking theo khách hàng hoặc sân..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-400 focus:bg-white transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="text-sm text-slate-400">{filteredBookings.length} booking</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Khách hàng</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sân</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngày đặt</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Giờ</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng tiền</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trả trước</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-16 text-slate-400">
                  <div className="text-4xl mb-3">📋</div>
                  <p className="font-semibold text-slate-500">Chưa có booking nào</p>
                  <p className="text-xs mt-1">Các booking sẽ hiển thị ở đây</p>
                </td>
              </tr>
            ) : (
              filteredBookings.map((b) => (
                <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="px-4 py-3.5 font-mono text-slate-400">#{b.id}</td>
                  <td className="px-4 py-3.5">{b.customer?.name || "—"}</td>
                  <td className="px-4 py-3.5">{b.court?.name || `Sân #${b.courtId}`}</td>
                  <td className="px-4 py-3.5">{b.bookingDateTime ? new Date(b.bookingDateTime).toLocaleDateString("vi-VN") : "—"}</td>
                  <td className="px-4 py-3.5">{b.bookingDateTime ? new Date(b.bookingDateTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "—"}</td>
                  <td className="px-4 py-3.5">{b.totalAmount?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</td>
                  <td className="px-4 py-3.5">{b.depositAmount?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(b.status)}`}>
                      {b.status || "—"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerBookingPage;