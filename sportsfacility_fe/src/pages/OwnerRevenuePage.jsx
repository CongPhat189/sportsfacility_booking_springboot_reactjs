import React, { useState, useEffect } from "react";
import { authAPIs, endpoints } from "../config/APIs";
import { CheckCircle, XCircle, Clock, TrendingUp, Search } from "lucide-react";

// ── Simple Bar Chart (no external lib) ──
const BarChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex items-end gap-2 h-48 w-full">
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        return (
          <div key={i} className="flex flex-col items-center flex-1 gap-1 group">
            {/* Tooltip */}
            <div className="opacity-0 group-hover:opacity-100 transition text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1 shadow whitespace-nowrap">
              {Number(d.value).toLocaleString("vi-VN")}₫
            </div>
            {/* Bar */}
            <div className="w-full flex items-end" style={{ height: "160px" }}>
              <div
                className={`w-full rounded-t-lg transition-all duration-500 ${d.color}`}
                style={{ height: `${Math.max(pct, 2)}%` }}
              />
            </div>
            {/* Label */}
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
};

const OwnerFinancePage = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRevenue = async (m, y) => {
    setLoading(true);
    setError("");
    try {
      const res = await authAPIs().get(endpoints["owner-revenue"], {
        params: { month: m, year: y },
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRevenue(month, year);
  }, []);

  const handleSearch = () => {
    if (!month || !year) return;
    loadRevenue(month, year);
  };

  // ── Derived values ──
  const completed = data?.completed   || { total: 0, totalAmount: 0, revenueAfterCommission: 0 };
  const cancelled = data?.cancelled   || { total: 0, totalAmount: 0, revenueAfterCommission: 0 };
  const expired   = data?.expired     || { total: 0, totalAmount: 0, revenueAfterCommission: 0 };
  const totalRevenue = (completed.revenueAfterCommission || 0) + (expired.revenueAfterCommission || 0);

  const cards = [
    {
      label: "Đơn hoàn thành",
      value: completed.total,
      sub: `${Number(completed.revenueAfterCommission).toLocaleString("vi-VN")}₫`,
      icon: <CheckCircle className="w-5 h-5" />,
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      iconBg: "bg-emerald-500",
      text: "text-emerald-600",
      subText: "text-emerald-500",
    },
    {
      label: "Đơn đã huỷ",
      value: cancelled.total,
      sub: `${Number(cancelled.totalAmount).toLocaleString("vi-VN")}₫`,
      icon: <XCircle className="w-5 h-5" />,
      bg: "bg-red-50",
      border: "border-red-100",
      iconBg: "bg-red-500",
      text: "text-red-600",
      subText: "text-red-400",
    },
    {
      label: "Đơn quá hạn",
      value: expired.total,
      sub: `${Number(expired.revenueAfterCommission).toLocaleString("vi-VN")}₫`,
      icon: <Clock className="w-5 h-5" />,
      bg: "bg-amber-50",
      border: "border-amber-100",
      iconBg: "bg-amber-500",
      text: "text-amber-600",
      subText: "text-amber-500",
    },
    {
      label: "Tổng doanh thu",
      value: `${Number(totalRevenue).toLocaleString("vi-VN")}₫`,
      sub: "Sau khi trừ hoa hồng",
      icon: <TrendingUp className="w-5 h-5" />,
      bg: "bg-blue-50",
      border: "border-blue-100",
      iconBg: "bg-blue-500",
      text: "text-blue-600",
      subText: "text-blue-400",
      bigValue: true,
    },
  ];

  const chartData = [
    {
      label: "Hoàn thành",
      value: completed.revenueAfterCommission || 0,
      color: "bg-emerald-400",
    },
    {
      label: "Quá hạn",
      value: expired.revenueAfterCommission || 0,
      color: "bg-amber-400",
    },
    {
      label: "Tổng cộng",
      value: totalRevenue,
      color: "bg-blue-500",
    },
  ];

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years  = Array.from({ length: 6 }, (_, i) => now.getFullYear() - i);

  return (
    <div className="p-6">
      {/* ── FILTER BAR ── */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Tháng</p>
          <select
            className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 outline-none focus:border-emerald-400 focus:bg-white transition min-w-[100px]"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {months.map((m) => (
              <option key={m} value={m}>Tháng {m}</option>
            ))}
          </select>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Năm</p>
          <select
            className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 outline-none focus:border-emerald-400 focus:bg-white transition min-w-[100px]"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <div className="mb-0 mt-5">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow shadow-emerald-200 transition"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <Search className="w-4 h-4" />
              )}
              Xem báo cáo
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm flex items-center gap-1 mt-5">⚠ {error}</p>
        )}
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 gap-4 mb-8 xl:grid-cols-4">
        {cards.map((c, i) => (
          <div
            key={i}
            className={`rounded-2xl border p-5 flex flex-col gap-3 ${c.bg} ${c.border}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{c.label}</p>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${c.iconBg}`}>
                {c.icon}
              </div>
            </div>
            <div>
              <p className={`font-bold leading-tight ${c.bigValue ? "text-xl" : "text-3xl"} ${c.text}`}>
                {c.value}
              </p>
              <p className={`text-xs mt-1 font-medium ${c.subText}`}>{c.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── CHART ── */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Biểu đồ doanh thu</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tháng {month}/{year} — Doanh thu sau hoa hồng
            </p>
          </div>
          <div className="flex items-center gap-4">
            {[
              { color: "bg-emerald-400", label: "Hoàn thành" },
              { color: "bg-amber-400",   label: "Quá hạn" },
              { color: "bg-blue-500",    label: "Tổng cộng" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
                <span className="text-xs text-slate-500">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
            Đang tải...
          </div>
        ) : (
          <BarChart data={chartData} />
        )}
      </div>
    </div>
  );
};

export default OwnerFinancePage;