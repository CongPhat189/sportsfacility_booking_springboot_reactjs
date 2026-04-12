import { useEffect, useState } from "react";
import { endpoints, authAPIs } from "../config/APIs";
import {
    PieChart, Pie, Cell, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";

const COLORS = ["#f59e0b", "#10b981", "#ef4444"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const StatCard = ({ label, value, sub, dotColor }) => (
    <div style={{
        background: "var(--color-background-secondary, #f5f5f5)",
        borderRadius: 8,
        padding: "14px 16px",
    }}>
        <div style={{ fontSize: 11, color: "#888", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            <span style={{
                display: "inline-block", width: 7, height: 7,
                borderRadius: "50%", background: dotColor,
                marginRight: 5, verticalAlign: "middle", position: "relative", top: -1
            }} />
            {label}
        </div>
        <div style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.2 }}>{value}</div>
        <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>{sub}</div>
    </div>
);

const AdminReport = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [bookingData, setBookingData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [aiInsight, setAiInsight] = useState("");
    const [aiLoading, setAiLoading] = useState(false);

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
            setRevenueData(revenueRes.data.map((r) => ({ month: r.month, revenue: r.revenue })));
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

    const pct = (v) => totalBookings ? Math.round((v / totalBookings) * 100) : 0;

    const analyzeWithAI = async () => {
        try {
            setAiLoading(true);
            const res = await authAPIs().post("/admin/reports/analyze", {
                pending, completed, cancelled, revenue: revenueData,
            });
            setAiInsight(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Lỗi AI");
        } finally {
            setAiLoading(false);
        }
    };

    const statCards = [
        { label: "Tổng booking", value: totalBookings, sub: `Tháng ${month}/${year}`, dotColor: "#7c3aed" },
        { label: "Chờ xử lý", value: pending, sub: `${pct(pending)}% tổng booking`, dotColor: "#f59e0b" },
        { label: "Hoàn thành", value: completed, sub: `${pct(completed)}% tổng booking`, dotColor: "#10b981" },
        { label: "Đã huỷ", value: cancelled, sub: `${pct(cancelled)}% tổng booking`, dotColor: "#ef4444" },
        { label: "Doanh thu", value: totalRevenue.toLocaleString("vi-VN") + " ₫", sub: "Doanh thu cao nhất trong 3 tháng", dotColor: "#3b82f6" },
    ];

    /* ── custom doughnut label ── */
    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        if (percent < 0.05) return null;
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        return (
            <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={500}>
                {`${Math.round(percent * 100)}%`}
            </text>
        );
    };

    /* ── custom bar tooltip ── */
    const RevenueTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        return (
            <div style={{
                background: "#fff", border: "0.5px solid #e5e7eb",
                borderRadius: 8, padding: "8px 12px", fontSize: 13,
            }}>
                <div style={{ color: "#888", marginBottom: 2 }}>{label}</div>
                <div style={{ fontWeight: 500, color: "#7c3aed" }}>
                    {Number(payload[0].value).toLocaleString("vi-VN")} ₫
                </div>
            </div>
        );
    };

    return (
        <div style={{ padding: "1.5rem", fontFamily: "sans-serif" }}>

            {/* ── Header ── */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                    <h2 style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>Báo cáo thống kê</h2>
                    <p style={{ fontSize: 13, color: "#888", marginTop: 3 }}>Tháng {month} / {year}</p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <select
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}
                        style={{ fontSize: 13, padding: "6px 10px", height: 34, border: "0.5px solid #d1d5db", borderRadius: 8, background: "#fff" }}
                    >
                        {MONTH_NAMES.map((m, i) => (
                            <option key={i} value={i + 1}>{m}</option>
                        ))}
                    </select>

                    <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        style={{ width: 80, fontSize: 13, padding: "6px 10px", height: 34, border: "0.5px solid #d1d5db", borderRadius: 8 }}
                    />

                    <button
                        onClick={analyzeWithAI}
                        disabled={aiLoading}
                        style={{
                            display: "flex", alignItems: "center", gap: 6,
                            fontSize: 13, fontWeight: 500, padding: "6px 14px", height: 34,
                            borderRadius: 8, background: "#7c3aed", color: "#fff",
                            border: "none", cursor: aiLoading ? "not-allowed" : "pointer",
                            opacity: aiLoading ? 0.7 : 1,
                        }}
                    >
                        ✦ Phân tích AI
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#888" }}>Đang tải...</div>
            ) : (
                <>
                    {/* ── Stat cards ── */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 10, marginBottom: "1.5rem" }}>
                        {statCards.map((s, i) => <StatCard key={i} {...s} />)}
                    </div>

                    {/* ── Charts ── */}
                    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,2fr)", gap: 12, marginBottom: "1.5rem" }}>

                        {/* Doughnut */}
                        <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
                            <h3 style={{ fontSize: 13, fontWeight: 500, color: "#888", marginBottom: 12 }}>Trạng thái booking</h3>
                            <PieChart width={220} height={180}>
                                <Pie
                                    data={bookingData}
                                    dataKey="value"
                                    cx="50%" cy="50%"
                                    innerRadius={52} outerRadius={80}
                                    labelLine={false}
                                    label={renderCustomLabel}
                                >
                                    {bookingData.map((_, i) => <Cell key={i} fill={COLORS[i]} stroke="none" />)}
                                </Pie>
                                <Tooltip formatter={(v, name) => [v, name === "Pending" ? "Chờ xử lý" : name === "Completed" ? "Hoàn thành" : "Đã huỷ"]} />
                            </PieChart>

                            {/* Legend */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 8 }}>
                                {[
                                    { label: "Chờ xử lý", value: pending, color: "#f59e0b" },
                                    { label: "Hoàn thành", value: completed, color: "#10b981" },
                                    { label: "Đã huỷ", value: cancelled, color: "#ef4444" },
                                ].map((l, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12 }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#666" }}>
                                            <span style={{ width: 8, height: 8, borderRadius: 2, background: l.color, display: "inline-block" }} />
                                            {l.label}
                                        </span>
                                        <span style={{ fontWeight: 500 }}>{l.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bar chart */}
                        <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
                            <h3 style={{ fontSize: 13, fontWeight: 500, color: "#888", marginBottom: 12 }}>Doanh thu theo tháng</h3>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={revenueData} barSize={28}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#888" }} />
                                    <YAxis
                                        axisLine={false} tickLine={false}
                                        tick={{ fontSize: 11, fill: "#888" }}
                                        tickFormatter={(v) => v >= 1000000 ? Math.round(v / 1000000) + "M" : v}
                                    />
                                    <Tooltip content={<RevenueTooltip />} />
                                    <Bar dataKey="revenue" fill="#7c3aed" fillOpacity={0.15} stroke="#7c3aed" strokeWidth={1.5} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* ── AI Panel ── */}
                    <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                            <span style={{
                                display: "flex", alignItems: "center", gap: 6,
                                background: "#f3f0ff", color: "#7c3aed",
                                fontSize: 12, fontWeight: 500,
                                padding: "3px 10px", borderRadius: 99,
                            }}>
                                ✦ Phân tích AI
                            </span>
                            <span style={{ fontSize: 13, color: "#aaa" }}>Nhận xét từ dữ liệu hiện tại</span>
                        </div>

                        {aiLoading ? (
                            <p style={{ color: "#aaa", fontSize: 14 }}>AI đang phân tích...</p>
                        ) : aiInsight ? (
                            <div style={{ fontSize: 14, lineHeight: 1.7 }}>
                                <ReactMarkdown>{aiInsight}</ReactMarkdown>
                            </div>
                        ) : (
                            <p style={{ color: "#aaa", fontSize: 14, textAlign: "center", padding: "1.5rem 0" }}>
                                Nhấn "Phân tích AI" để xem insight từ dữ liệu
                            </p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminReport;