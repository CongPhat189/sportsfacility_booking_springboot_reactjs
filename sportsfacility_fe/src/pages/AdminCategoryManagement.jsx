import { useEffect, useState } from "react";
import { endpoints, authAPIs } from "../config/APIs";
import { toast } from "react-toastify";

const AdminCategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        name: "",
        description: "",
        isActive: true,
    });

    const [editingId, setEditingId] = useState(null);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const res = await authAPIs().get(endpoints.getCategories);
            setCategories(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Lỗi load categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            toast.error("Tên không được để trống");
            return;
        }
        try {
            if (editingId) {
                await authAPIs().put(endpoints.updateCategory(editingId), form);
                toast.success("Cập nhật thành công");
            } else {
                await authAPIs().post(endpoints.createCategory, form);
                toast.success("Thêm thành công");
            }
            resetForm();
            loadCategories();
        } catch (err) {
            console.error(err.response);
            toast.error(err.response?.data || "Lỗi xử lý");
        }
    };

    const resetForm = () => {
        setForm({ name: "", description: "", isActive: true });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (c) => {
        setForm({
            name: c.name,
            description: c.description || "",
            isActive: c.isActive ?? c.active,
        });
        setEditingId(c.id);
        setShowForm(true);
    };

    const deleteCategory = async (id) => {
        if (!window.confirm("Xóa category này?")) return;
        try {
            await authAPIs().delete(endpoints.deleteCategory(id));
            toast.success("Đã xóa");
            loadCategories();
        } catch (err) {
            console.error(err);
            toast.error("Lỗi xóa");
        }
    };

    const enableCategory = async (id) => {
        try {
            await authAPIs().put(endpoints.enableCategory(id));
            toast.success("Đã bật");
            loadCategories();
        } catch (err) {
            console.error(err);
            toast.error("Lỗi enable");
        }
    };

    const disableCategory = async (id) => {
        try {
            await authAPIs().put(endpoints.disableCategory(id));
            toast.success("Đã tắt");
            loadCategories();
        } catch (err) {
            console.error(err);
            toast.error("Lỗi disable");
        }
    };

    const isActive = (c) => c.isActive ?? c.active;

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Quản lý danh mục</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {categories.length} danh mục trong hệ thống
                    </p>
                </div>
                <button
                    onClick={() => {
                        if (showForm && !editingId) {
                            resetForm();
                        } else {
                            setEditingId(null);
                            setForm({ name: "", description: "", isActive: true });
                            setShowForm(true);
                        }
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                    <span className="text-base leading-none">+</span>
                    Thêm danh mục
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="border border-gray-200 rounded-xl p-5 mb-6 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">
                        {editingId ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Tên danh mục *"
                                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-violet-400 bg-white"
                            />
                            <select
                                value={form.isActive}
                                onChange={(e) =>
                                    setForm({ ...form, isActive: e.target.value === "true" })
                                }
                                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-violet-400 bg-white text-gray-700"
                            >
                                <option value="true">Active</option>
                                <option value="false">Disabled</option>
                            </select>
                        </div>
                        <input
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Mô tả (tuỳ chọn)"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-violet-400 bg-white"
                        />
                        <div className="flex gap-2 pt-1">
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                            >
                                {editingId ? "Cập nhật" : "Thêm"}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-sm font-medium border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="py-12 text-center text-sm text-gray-400">Đang tải dữ liệu...</div>
                ) : (
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b-2 border-gray-300">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200 w-1/4">
                                    Tên
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200 w-2/5">
                                    Mô tả
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide border-r border-gray-200 w-1/6">
                                    Trạng thái
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-10 text-center text-sm text-gray-400">
                                        Chưa có danh mục nào
                                    </td>
                                </tr>
                            ) : (
                                categories.map((c, idx) => (
                                    <tr
                                        key={c.id}
                                        className={`border-b border-gray-200 hover:bg-violet-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                            }`}
                                    >
                                        <td className="px-4 py-3 font-medium text-gray-800 border-r border-gray-200">
                                            {c.name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 border-r border-gray-200">
                                            {c.description || <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-200">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isActive(c)
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : "bg-red-50 text-red-500"
                                                    }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${isActive(c) ? "bg-emerald-500" : "bg-red-400"
                                                        }`}
                                                />
                                                {isActive(c) ? "Active" : "Disabled"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">

                                                {/* Edit — bút chì */}
                                                <button
                                                    onClick={() => handleEdit(c)}
                                                    title="Chỉnh sửa"
                                                    className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                </button>

                                                {/* Toggle bật/tắt */}
                                                <button
                                                    onClick={() => isActive(c) ? disableCategory(c.id) : enableCategory(c.id)}
                                                    title={isActive(c) ? "Tắt" : "Bật"}
                                                    className="relative inline-flex items-center cursor-pointer"
                                                >
                                                    <div className={`w-9 h-5 rounded-full transition-colors duration-200 ${isActive(c) ? "bg-emerald-500" : "bg-gray-300"}`}>
                                                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isActive(c) ? "translate-x-4" : "translate-x-0.5"}`} />
                                                    </div>
                                                </button>

                                                {/* Delete — dấu X */}
                                                <button
                                                    onClick={() => deleteCategory(c.id)}
                                                    title="Xóa"
                                                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="18" y1="6" x2="6" y2="18" />
                                                        <line x1="6" y1="6" x2="18" y2="18" />
                                                    </svg>
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

export default AdminCategoryManagement;