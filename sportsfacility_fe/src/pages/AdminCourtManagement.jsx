import { useEffect, useState } from "react";
import { endpoints, authAPIs } from "../config/APIs";
import { toast } from "react-toastify";

const AdminCourtManagement = () => {
    const [pendingCourts, setPendingCourts] = useState([]);
    const [activeCourts, setActiveCourts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [tab, setTab] = useState("PENDING");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [commissionMap, setCommissionMap] = useState({});

    // ===== LOAD =====
    const loadData = async () => {
        try {
            setLoading(true);
            const [pendingRes, activeRes] = await Promise.all([
                authAPIs().get(endpoints.pendingCourts),
                authAPIs().get(endpoints.activeCourts),
            ]);
            setPendingCourts(pendingRes.data);
            setActiveCourts(activeRes.data);
            const map = {};
            [...pendingRes.data, ...activeRes.data].forEach((c) => {
                map[c.id] = c.commissionRate || 0;
            });
            setCommissionMap(map);
        } catch (err) {
            console.error(err);
            toast.error("Lỗi load courts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);
    useEffect(() => { setCurrentPage(1); }, [tab]);

    // ===== APPROVE =====
    const approveCourt = async (id) => {
        try {
            await authAPIs().put(endpoints.approveCourt(id));
            toast.success("Đã duyệt");
            loadData();
        } catch (err) {
            console.error(err);
            toast.error("Lỗi duyệt");
        }
    };

    // ===== REJECT =====
    const rejectCourt = async (id) => {
        const reason = prompt("Nhập lý do từ chối:");
        if (!reason || !reason.trim()) {
            toast.error("Bạn phải nhập lý do");
            return;
        }
        try {
            await authAPIs().put(endpoints.rejectCourt(id), { rejectReason: reason });
            toast.success("Đã từ chối");
            loadData();
        } catch (err) {
            console.error(err);
            toast.error("Lỗi reject");
        }
    };

    // ===== UPDATE COMMISSION =====
    const updateCommission = async (id) => {
        try {
            await authAPIs().put(endpoints.updateCommission(id), {
                commissionRate: Number(commissionMap[id]),
            });
            toast.success("Cập nhật thành công");
        } catch (err) {
            console.error(err);
            toast.error("Lỗi update");
        }
    };

    const courts = tab === "PENDING" ? pendingCourts : activeCourts;
    const totalPages = Math.ceil(courts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentCourts = courts.slice(startIndex, startIndex + itemsPerPage);

    const getImageUrl = (url) => {
        if (!url) return null;
        return url.startsWith("http") ? url : `${import.meta.env.VITE_API_URL || 'http://localhost:8080/'}${url}`;
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Quản lý sân</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {tab === "PENDING"
                            ? `${pendingCourts.length} sân đang chờ duyệt`
                            : `${activeCourts.length} sân đang hoạt động`}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setTab("PENDING")}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${tab === "PENDING"
                                ? "bg-white text-amber-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Chờ duyệt
                        {pendingCourts.length > 0 && (
                            <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-xs bg-amber-100 text-amber-600 rounded-full">
                                {pendingCourts.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setTab("ACTIVE")}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${tab === "ACTIVE"
                                ? "bg-white text-emerald-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Đã duyệt
                    </button>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="py-16 text-center text-sm text-gray-400">Đang tải dữ liệu...</div>
            ) : (
                <>
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-gray-100 border-b-2 border-gray-300">
                                    {["Sân", "Chủ sân", "Danh mục", "Địa chỉ", "Commission", "Trạng thái", tab === "PENDING" ? "Hành động" : ""].filter(Boolean).map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200 last:border-r-0">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {currentCourts.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-sm text-gray-400">
                                            Không có sân nào
                                        </td>
                                    </tr>
                                ) : (
                                    currentCourts.map((c, idx) => (
                                        <tr
                                            key={c.id}
                                            className={`border-b border-gray-200 hover:bg-violet-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                }`}
                                        >
                                            {/* Sân — ảnh + tên */}
                                            <td className="px-4 py-3 border-r border-gray-200">
                                                <div className="flex items-center gap-3">
                                                    {c.imageUrl ? (
                                                        <img
                                                            src={getImageUrl(c.imageUrl)}
                                                            alt={c.name}
                                                            className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-800 leading-tight">{c.name}</p>
                                                        {c.description && (
                                                            <p className="text-xs text-gray-400 mt-0.5 max-w-[140px] truncate">{c.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Owner */}
                                            <td className="px-4 py-3 text-gray-700 border-r border-gray-200 whitespace-nowrap">
                                                {c.ownerName}
                                            </td>

                                            {/* Category */}
                                            <td className="px-4 py-3 border-r border-gray-200">
                                                <span className="inline-block px-2 py-0.5 bg-violet-50 text-violet-700 text-xs font-medium rounded">
                                                    {c.categoryName}
                                                </span>
                                            </td>

                                            {/* Địa chỉ */}
                                            <td className="px-4 py-3 text-gray-500 border-r border-gray-200 max-w-[160px]">
                                                <span className="block truncate text-xs">{c.address}</span>
                                            </td>

                                            {/* Commission */}
                                            <td className="px-4 py-3 border-r border-gray-200">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            value={commissionMap[c.id] ?? ""}
                                                            onChange={(e) =>
                                                                setCommissionMap({ ...commissionMap, [c.id]: e.target.value })
                                                            }
                                                            className="w-16 px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-violet-400 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                        />
                                                        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">%</span>
                                                    </div>
                                                    <button
                                                        onClick={() => updateCommission(c.id)}
                                                        title="Lưu commission"
                                                        className="p-1 rounded-lg text-violet-500 hover:bg-violet-50 transition-colors"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-3 border-r border-gray-200">
                                                {c.status === "PENDING" && (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                        Chờ duyệt
                                                    </span>
                                                )}
                                                {c.status === "ACTIVE" && (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                        Hoạt động
                                                    </span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            {tab === "PENDING" && (
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => approveCourt(c.id)}
                                                            title="Duyệt"
                                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                            Duyệt
                                                        </button>
                                                        <button
                                                            onClick={() => rejectCourt(c.id)}
                                                            title="Từ chối"
                                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                                            Từ chối
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-xs text-gray-400">
                                Hiển thị {startIndex + 1}–{Math.min(startIndex + itemsPerPage, courts.length)} / {courts.length} sân
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    ← Trước
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-8 h-8 text-xs rounded-lg transition-colors ${currentPage === i + 1
                                                ? "bg-violet-600 text-white"
                                                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    Sau →
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminCourtManagement;