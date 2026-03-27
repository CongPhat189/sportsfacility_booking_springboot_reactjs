import { useEffect, useState } from "react";
import { endpoints, authAPIs } from "../config/APIs";
import {
    PieChart, Pie, Cell, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";
import { toast } from "react-toastify";

const COLORS = ["#f59e0b", "#10b981", "#ef4444"];

const AdminReport = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [bookingData, setBookingData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadReport = async () => {
        try {
            setLoading(true);
            const [bookingRes, revenueRes] = await Promise.all([
                authAPIs().get(endpoints.adminBookingReport(month, year)),
                authAPIs().get(endpoints.adminrevenueReport(month, year)),
            ]);

            const booking = bookingRes.data;
            setBookingData([
                { name: "Pending", value: booking.pending },
                { name: "Completed", value: booking.completed },
                { name: "Cancelled", value: booking.cancelled },
            ]);

            setRevenueData(
                revenueRes.data.map((r) => ({ month: r.month, revenue: r.revenue }))
            );
        } catch (err) {
            console.error(err);
            toast.error("Lỗi load report");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadReport(); }, [month, year]);

    const totalBookings = bookingData.reduce((s, d) => s + (d.value || 0), 0);
    const pending = bookingData.find((d) => d.name === "Pending")?.value || 0;
    const completed = bookingData.find((d) => d.name === "Completed")?.value || 0;
    const cancelled = bookingData.find((d) => d.name === "Cancelled")?.value || 0;
    const totalRevenue = revenueData.reduce((s, d) => s + (d.revenue || 0), 0);

    const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const statCards = [
        {
            label: "Tổng booking",
            value: totalBookings,
            sub: `Tháng ${month}/${year}`,
            color: "bg-violet-50 text-violet-700",
            dot: "bg-violet-400",
        },
        {
            label: "Chờ xử lý",
            value: pending,
            sub: `${totalBookings ? Math.round((pending / totalBookings) * 100) : 0}% tổng booking`,
            color: "bg-amber-50 text-amber-700",
            dot: "bg-amber-400",
        },
        {
            label: "Hoàn thành",
            value: completed,
            sub: `${totalBookings ? Math.round((completed / totalBookings) * 100) : 0}% tổng booking`,
            color: "bg-emerald-50 text-emerald-700",
            dot: "bg-emerald-500",
        },
        {
            label: "Đã huỷ",
            value: cancelled,
            sub: `${totalBookings ? Math.round((cancelled / totalBookings) * 100) : 0}% tổng booking`,
            color: "bg-red-50 text-red-600",
            dot: "bg-red-400",
        },
        {
            label: "Doanh thu",
            value: totalRevenue.toLocaleString("vi-VN") + " ₫",
            sub: "Doanh thu tháng này của hệ thống",
            color: "bg-blue-50 text-blue-700",
            dot: "bg-blue-400",
        },
    ];

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Báo cáo thống kê</h2>
                    <p className="text-sm text-gray-500 mt-1">Tháng {month} / {year}</p>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                    <select
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-violet-400 bg-white text-gray-700"
                    >
                        {MONTH_NAMES.map((m, i) => (
                            <option key={i} value={i + 1}>{m}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="w-24 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-violet-400 bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="Năm"
                    />
                </div>
            </div>

            {loading ? (
                <div className="py-16 text-center text-sm text-gray-400">Đang tải dữ liệu...</div>
            ) : (
                <>
                    {/* Stats bar */}
                    <div className="grid grid-cols-5 gap-3 mb-6">
                        {statCards.map((s, i) => (
                            <div key={i} className="border border-gray-200 rounded-xl p-4 bg-white">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                                    <span className="text-xs text-gray-500">{s.label}</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-800 leading-tight">{s.value}</p>
                                <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* Pie Chart */}
                        <div className="border border-gray-200 rounded-xl p-5">
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-gray-700">Trạng thái booking</h3>
                                <p className="text-xs text-gray-400 mt-0.5">Tổng {totalBookings} booking</p>
                            </div>

                            <div className="flex justify-center gap-4 mb-3">
                                {bookingData.map((entry, i) => (
                                    <div key={i} className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                                        <span className="text-xs text-gray-500">{entry.name}</span>
                                        <span className="text-xs font-medium text-gray-700">{entry.value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center">
                                <PieChart width={260} height={260}>
                                    <Pie
                                        data={bookingData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {bookingData.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            fontSize: "12px",
                                            borderRadius: "8px",
                                            border: "1px solid #e5e7eb",
                                            boxShadow: "none",
                                        }}
                                    />
                                </PieChart>
                            </div>
                        </div>

                        {/* Bar Chart */}
                        <div className="border border-gray-200 rounded-xl p-5">
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-gray-700">Doanh thu</h3>
                                <p className="text-xs text-gray-400 mt-0.5">3 tháng gần nhất</p>
                            </div>

                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={revenueData} barSize={32}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(v) =>
                                            v >= 1000000
                                                ? `${(v / 1000000).toFixed(1)}M`
                                                : v >= 1000
                                                    ? `${(v / 1000).toFixed(0)}K`
                                                    : v
                                        }
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            fontSize: "12px",
                                            borderRadius: "8px",
                                            border: "1px solid #e5e7eb",
                                            boxShadow: "none",
                                        }}
                                        formatter={(v) => [v.toLocaleString("vi-VN") + " ₫", "Doanh thu"]}
                                    />
                                    <Bar dataKey="revenue" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                    </div>
                </>
            )}
        </div>
    );
};

export default AdminReport;