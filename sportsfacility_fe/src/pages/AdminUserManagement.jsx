import { useEffect, useState } from "react";
import APIs, { endpoints, authAPIs } from "../config/APIs";
import { toast } from "react-toastify";

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const loadUsers = async () => {
        try {
            setLoading(true);
            const res = await authAPIs().get(endpoints.getListUsers);
            setUsers(res.data);
        } catch (err) {
            toast.error("Lỗi load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const lockUser = async (id) => {
        try {
            await authAPIs().put(endpoints.lockUser(id));
            toast.success("Đã khóa user");
            loadUsers();
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khóa user");
        }
    };

    const unlockUser = async (id) => {
        try {
            await authAPIs().put(endpoints.unlockUser(id));
            toast.success("Đã mở khóa user");
            loadUsers();
        } catch (err) {
            console.error(err);
            toast.error("Lỗi mở khóa user");
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Xóa user này?")) return;
        try {
            await authAPIs().delete(endpoints.deleteUser(id));
            toast.success("Đã xóa user");
            loadUsers();
        } catch (err) {
            console.error(err);
            toast.error("Lỗi xóa user");
        }
    };

    const filteredUsers = users.filter((u) => {
        const matchSearch =
            !search ||
            u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" || u.status === filter;
        return matchSearch && matchFilter;
    });

    const totalActive = users.filter((u) => u.status === "ACTIVE").length;
    const totalLocked = users.filter((u) => u.status === "LOCKED").length;

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Quản lý người dùng</h2>
                <p className="text-sm text-gray-500 mt-1">Danh sách tài khoản trong hệ thống</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Tổng người dùng</p>
                    <p className="text-2xl font-semibold text-gray-800">{users.length}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4">
                    <p className="text-xs text-emerald-700 mb-1">Đang hoạt động</p>
                    <p className="text-2xl font-semibold text-emerald-700">{totalActive}</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4">
                    <p className="text-xs text-red-600 mb-1">Đã khóa</p>
                    <p className="text-2xl font-semibold text-red-600">{totalLocked}</p>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-3 mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm theo tên, email..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-white"
                />
                {["all", "ACTIVE", "LOCKED"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${filter === f
                                ? "bg-violet-100 text-violet-800 border-violet-300"
                                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        {f === "all" ? "Tất cả" : f === "ACTIVE" ? "Active" : "Locked"}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="border border-gray-100 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="py-12 text-center text-sm text-gray-400">Đang tải dữ liệu...</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {["Tên", "Email", "Số điện thoại", "Vai trò", "Trạng thái", "Hành động"].map((h) => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-sm text-gray-400">
                                        Không tìm thấy người dùng
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                        {/* Name */}
                                        <td className="px-4 py-3">
                                            <span className="font-medium text-gray-800 truncate max-w-[120px]">
                                                {u.fullName}
                                            </span>
                                        </td>

                                        {/* Email */}
                                        <td className="px-4 py-3 text-gray-500 truncate max-w-[160px]">{u.email}</td>

                                        {/* Phone */}
                                        <td className="px-4 py-3 text-gray-600">{u.phone}</td>

                                        {/* Role */}
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${u.role === "ADMIN"
                                                        ? "bg-violet-100 text-violet-800"
                                                        : u.role === "MANAGER"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {u.role}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${u.status === "ACTIVE"
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : "bg-red-50 text-red-600"
                                                    }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${u.status === "ACTIVE" ? "bg-emerald-500" : "bg-red-400"
                                                        }`}
                                                />
                                                {u.status === "ACTIVE" ? "Active" : "Locked"}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {u.status === "ACTIVE" ? (
                                                    <button
                                                        onClick={() => lockUser(u.id)}
                                                        className="px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                                                    >
                                                        Khóa
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => unlockUser(u.id)}
                                                        className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                                                    >
                                                        Mở khóa
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteUser(u.id)}
                                                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminUserManagement;