import React, { useState, useEffect } from "react";
import { authAPIs, endpoints } from "../config/APIs";
import { Search, CheckCircle, XCircle, AlertTriangle, X, LogIn, Flag } from "lucide-react";

// ── Toast Modal component ──
const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast]);

  if (!toast) return null;

  const styles = {
    success: {
      bg: "bg-emerald-50 border-emerald-200",
      icon: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />,
      title: "text-emerald-700",
      msg: "text-emerald-600",
      close: "text-emerald-400 hover:text-emerald-600",
    },
    error: {
      bg: "bg-red-50 border-red-200",
      icon: <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />,
      title: "text-red-700",
      msg: "text-red-600",
      close: "text-red-400 hover:text-red-600",
    },
    warning: {
      bg: "bg-amber-50 border-amber-200",
      icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />,
      title: "text-amber-700",
      msg: "text-amber-600",
      close: "text-amber-400 hover:text-amber-600",
    },
  };

  const s = styles[toast.type] || styles.success;

  return (
    <div className="fixed top-5 right-5 z-50 animate-slide-in">
      <div className={`flex items-start gap-3 border rounded-2xl px-4 py-3.5 shadow-lg max-w-sm w-full ${s.bg}`}>
        {s.icon}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${s.title}`}>{toast.title}</p>
          {toast.message && (
            <p className={`text-xs mt-0.5 ${s.msg}`}>{toast.message}</p>
          )}
        </div>
        <button onClick={onClose} className={`shrink-0 transition ${s.close}`}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ── Confirm Modal component ──
const ConfirmModal = ({ confirm, onCancel, onOk }) => {
  if (!confirm) return null;

  const styles = {
    confirm: { icon: "✅", color: "bg-blue-500 hover:bg-blue-600", label: "Xác nhận" },
    reject: { icon: "❌", color: "bg-red-500 hover:bg-red-600", label: "Từ chối" },
    checkin: { icon: "🏃", color: "bg-emerald-500 hover:bg-emerald-600", label: "Check-in" },
    complete: { icon: "🏆", color: "bg-purple-500 hover:bg-purple-600", label: "Hoàn thành" },
  };

  const s = styles[confirm.type] || styles.confirm;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl w-[360px] max-w-[95vw] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-6 text-center">
          <div className="text-4xl mb-3">{s.icon}</div>
          <h3 className="text-base font-bold text-slate-800 mb-1">{confirm.title}</h3>
          <p className="text-sm text-slate-500">{confirm.message}</p>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
          >
            Huỷ
          </button>
          <button
            onClick={onOk}
            className={`flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition ${s.color}`}
          >
            {s.label}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ──
const OwnerBookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null); // { type, title, message, onOk }

  const showToast = (type, title, message = "") => setToast({ type, title, message });
  const hideToast = () => setToast(null);

  const showConfirm = (type, title, message, onOk) =>
    setConfirm({ type, title, message, onOk });
  const hideConfirm = () => setConfirm(null);

  const loadBookings = async () => {
    try {
      const res = await authAPIs().get(endpoints["owner-bookings"]);
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filteredBookings = bookings.filter((b) =>
    b.customerName.toLowerCase().includes(keyword.toLowerCase())
  );

  const statusMap = {
    PENDING: { label: "Chờ xác nhận", cls: "bg-amber-50 text-amber-600" },
    CONFIRMED: { label: "Đã xác nhận", cls: "bg-blue-50 text-blue-600" },
    CHECKED_IN: { label: "Đã check-in", cls: "bg-emerald-50 text-emerald-600" },
    COMPLETED: { label: "Hoàn thành", cls: "bg-green-100 text-green-600" },
    CANCELLED: { label: "Đã huỷ", cls: "bg-red-50 text-red-500" },
    EXPIRED: { label: "Hết hạn", cls: "bg-slate-100 text-slate-400" },
  };

  const renderStatus = (status) => {
    const s = statusMap[status];
    return s ? (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${s.cls}`}>
        {s.label}
      </span>
    ) : (
      <span className="text-slate-400 text-xs">{status}</span>
    );
  };

  // ── Handlers dùng modal thay alert ──
  const handleConfirm = (id) => {
    showConfirm(
      "confirm",
      "Xác nhận đặt sân?",
      "Booking này sẽ được xác nhận và khách hàng sẽ nhận thông báo.",
      async () => {
        hideConfirm();
        try {
          await authAPIs().put(endpoints["confirm-booking"](id));
          showToast("success", "Đã xác nhận!", "Booking đã được xác nhận thành công.");
          loadBookings();
        } catch (err) {
          showToast("error", "Xác nhận thất bại", err.response?.data || "Vui lòng thử lại.");
        }
      }
    );
  };

  const handleReject = (id) => {
    showConfirm(
      "reject",
      "Từ chối booking?",
      "Hành động này không thể hoàn tác. Khách hàng sẽ được thông báo.",
      async () => {
        hideConfirm();
        try {
          const res = await authAPIs().put(endpoints["reject-booking"](id));

          // 🔥 FIX: kiểm tra status
          if (res.status >= 200 && res.status < 300) {
            showToast("success", "Đã từ chối", "Booking đã được từ chối thành công.");
          } else {
            throw new Error("Response không hợp lệ");
          }

          loadBookings();
        } catch (err) {
          console.error("Reject error:", err);
          showToast(
            "error",
            "Từ chối thất bại",
            err.response?.data || err.message || "Vui lòng thử lại."
          );
        }
      }
    );
  };

  const handleCheckin = (id) => {
    showConfirm(
      "checkin",
      "Xác nhận check-in?",
      "Khách hàng sẽ được đánh dấu là đã vào sân.",
      async () => {
        hideConfirm();
        try {
          await authAPIs().put(endpoints["checkin-booking"](id));
          showToast("success", "Check-in thành công!", "Khách hàng đã được check-in.");
          loadBookings();
        } catch (err) {
          const msg = err.response?.data || "Có thể chưa tới giờ hoặc đã quá hạn.";
          showToast("error", "Check-in thất bại", msg);
          loadBookings(); // reload để cập nhật trạng thái mới (VD: EXPIRED)
        }
      }
    );
  };

  const handleComplete = (id) => {
    showConfirm(
      "complete",
      "Hoàn thành booking?",
      "Booking sẽ được đánh dấu là hoàn thành.",
      async () => {
        hideConfirm();
        try {
          await authAPIs().put(endpoints["complete-booking"](id));
          showToast("success", "Hoàn thành!", "Booking đã được đánh dấu hoàn thành.");
          loadBookings();
        } catch (err) {
          showToast("error", "Thất bại", err.response?.data || "Vui lòng thử lại.");
        }
      }
    );
  };

  const renderActions = (b) => {
    switch (b.status) {
      case "PENDING":
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleReject(b.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
            >
              <XCircle className="w-3.5 h-3.5" /> Từ chối
            </button>
          </div>
        );

      case "CONFIRMED":
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCheckin(b.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition"
            >
              <LogIn className="w-3.5 h-3.5" /> Check-in
            </button>

            <button
              onClick={() => handleReject(b.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
            >
              <XCircle className="w-3.5 h-3.5" /> Từ chối
            </button>
          </div>
        );

      case "CHECKED_IN":
        return (
          <button
            onClick={() => handleComplete(b.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-purple-500 hover:bg-purple-600 rounded-lg transition"
          >
            <Flag className="w-3.5 h-3.5" /> Hoàn thành
          </button>
        );

      default:
        return <span className="text-slate-300 text-xs">—</span>;
    }
  };

  return (
    <>
      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in { animation: slide-in 0.22s ease; }
      `}</style>

      {/* Toast */}
      <Toast toast={toast} onClose={hideToast} />

      {/* Confirm Modal */}
      <ConfirmModal
        confirm={confirm}
        onCancel={hideConfirm}
        onOk={confirm?.onOk}
      />

      <div className="p-6">
        {/* TOOLBAR */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3 flex-1 flex-wrap">
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm khách hàng..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-400 focus:bg-white transition"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <span className="text-sm text-slate-400">{filteredBookings.length} đơn</span>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-100 bg-slate-50">
                {["ID", "Khách hàng", "Sân", "Thời gian đặt", "Tổng tiền", "Trả trước", "Trạng thái", "Tính năng"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-slate-400">
                    <div className="text-4xl mb-3">📋</div>
                    <p className="font-semibold text-slate-500">Không có đơn đặt sân</p>
                    <p className="text-xs mt-1">Chưa có booking nào phù hợp</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        #{b.id}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">{b.customerName}</td>
                    <td className="px-4 py-3.5 text-slate-600">{b.courtName}</td>
                    <td className="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                      {new Date(b.bookingDateTime).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-emerald-600 whitespace-nowrap">
                      {b.totalAmount.toLocaleString("vi-VN")}₫
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-blue-500 whitespace-nowrap">
                      {b.depositAmount.toLocaleString("vi-VN")}₫
                    </td>
                    <td className="px-4 py-3.5">{renderStatus(b.status)}</td>
                    <td className="px-4 py-3.5">{renderActions(b)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default OwnerBookingPage;