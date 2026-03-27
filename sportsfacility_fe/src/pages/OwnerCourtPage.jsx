import React, { useState, useEffect } from "react";
import { authAPIs, endpoints } from "../config/APIs";
import { Plus, Pencil, Trash2, X, ImageOff, Search } from "lucide-react";

const OwnerCourtPage = () => {
  const [courts, setCourts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  const [search, setSearch] = useState("");

  const [newCourt, setNewCourt] = useState({
    name: "",
    address: "",
    description: "",
    imageUrl: "",
    categoryId: "",
    seatNumber: 0,
  });

  const ownerId = 1;

  // Load sân + category
  useEffect(() => {
    const loadCourts = async () => {
      try {
        const res = await authAPIs().get(endpoints["owner-courts"]);
        setCourts(res.data);
      } catch (err) {
        console.error("Error fetching courts:", err);
      }
    };

    const loadCategories = async () => {
      try {
        const res = await authAPIs().get(endpoints["categories"]);
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    loadCourts();
    loadCategories();
  }, []);

  // Thêm sân
  const handleAddCourt = async () => {
    try {
      const courtData = { ownerId, ...newCourt };
      const res = await authAPIs().post(endpoints["owner-courts"], courtData);
      setCourts([...courts, res.data]);
      setShowModal(false);
      resetForm();
      alert("Thêm sân thành công!");
    } catch (err) {
      console.error("Lỗi khi thêm sân:", err);
      alert("Thêm sân thất bại!");
    }
  };

  // Mở modal sửa
  const handleEdit = (court) => {
    setEditingCourt(court);
    setNewCourt({
      name: court.name,
      address: court.address,
      description: court.description,
      imageUrl: court.imageUrl,
      categoryId: court.categoryId || "",
      seatNumber: court.seatNumber || 0,
    });
    setShowModal(true);
  };

  // Cập nhật sân
  const handleUpdateCourt = async () => {
    try {
      const courtData = { ownerId, ...newCourt };
      const res = await authAPIs().put(
        `${endpoints["owner-courts"]}/${editingCourt.id}`,
        courtData
      );
      setCourts(courts.map((c) => (c.id === editingCourt.id ? res.data : c)));
      setShowModal(false);
      setEditingCourt(null);
      resetForm();
      alert("Cập nhật sân thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật sân:", err);
      alert("Cập nhật sân thất bại!");
    }
  };

  // Xóa sân
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sân này không?")) return;
    try {
      await authAPIs().delete(`${endpoints["owner-courts"]}/${id}`);
      setCourts(courts.filter((c) => c.id !== id));
      alert("Xóa thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa sân:", err);
      alert("Xóa thất bại!");
    }
  };

  const resetForm = () => {
    setNewCourt({ name: "", address: "", description: "", imageUrl: "", categoryId: "", seatNumber: 0 });
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCourt(null);
    resetForm();
  };

  const filteredCourts = courts.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.address?.toLowerCase().includes(search.toLowerCase())
  );

  const statusStyle = (status) => {
    if (!status) return "bg-slate-100 text-slate-400";
    const s = status.toLowerCase();

    if (s === "active") 
      return "bg-emerald-50 text-emerald-600";

    if (s === "pending") 
      return "bg-amber-50 text-amber-600";

    if (s === "rejected") 
      return "bg-red-50 text-red-500";

    return "bg-slate-100 text-slate-400";
  };

  return (
    <div className="p-6">
      {/* ── TOOLBAR ── */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm sân theo tên, địa chỉ..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-400 focus:bg-white transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="text-sm text-slate-400">{filteredCourts.length} sân</span>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow shadow-emerald-200 transition"
        >
          <Plus className="w-4 h-4" />
          Thêm sân
        </button>
      </div>

      {/* ── TABLE ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sân</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hình ảnh</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mô tả</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Loại sân</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tính năng</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourts.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-slate-400">
                  <div className="text-4xl mb-3">🏟️</div>
                  <p className="font-semibold text-slate-500">Chưa có sân nào</p>
                  <p className="text-xs mt-1">Nhấn "Thêm sân" để bắt đầu</p>
                </td>
              </tr>
            ) : (
              filteredCourts.map((court) => (
                <tr key={court.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      #{court.id}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-slate-800">{court.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{court.address}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    {court.imageUrl ? (
                      <img
                        src={court.imageUrl}
                        alt={court.name}
                        className="w-14 h-10 object-cover rounded-lg border border-slate-200"
                      />
                    ) : (
                      <div className="w-14 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <ImageOff className="w-4 h-4 text-slate-300" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3.5 max-w-[180px]">
                    <p className="text-slate-500 text-xs truncate">{court.description || "—"}</p>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">{court.categoryName || "—"}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(court.status)}`}>
                      {court.status || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(court)}
                      disabled={court.status?.toLowerCase() !== "rejected"}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition
                        ${
                          court.status?.toLowerCase() === "rejected"
                            ? "bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white"
                            : "bg-slate-100 text-slate-300 cursor-not-allowed"
                        }
                      `}
                      title="Sửa"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(court.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── MODAL ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl w-[440px] max-w-[95vw] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">
                {editingCourt ? "✏️ Sửa thông tin sân" : "➕ Thêm sân mới"}
              </h2>
              <button
                onClick={closeModal}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 flex flex-col gap-4">
              {[
                { label: "Tên sân", key: "name", placeholder: "VD: Sân bóng Thủ Đức" },
                { label: "Địa chỉ", key: "address", placeholder: "VD: 123 Lê Văn Việt, TP.HCM" },
                { label: "Mô tả", key: "description", placeholder: "Mô tả ngắn về sân..." },
                { label: "URL Hình ảnh", key: "imageUrl", placeholder: "https://..." },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</p>
                  <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-400 focus:bg-white transition"
                    value={newCourt[key]}
                    onChange={(e) => setNewCourt({ ...newCourt, [key]: e.target.value })}
                  />
                </div>
              ))}

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Loại sân</p>
                <select
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 outline-none focus:border-emerald-400 focus:bg-white transition"
                  value={newCourt.categoryId}
                  onChange={(e) => setNewCourt({ ...newCourt, categoryId: e.target.value })}
                >
                  <option value="">-- Chọn loại sân --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id} - {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={editingCourt ? handleUpdateCourt : handleAddCourt}
                className="px-5 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow shadow-emerald-200 transition"
              >
                {editingCourt ? "Cập nhật" : "Thêm sân"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerCourtPage;