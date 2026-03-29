import React, { useState, useEffect, useRef } from "react";
import { authAPIs, endpoints } from "../config/APIs";
import { Plus, Pencil, X, ImageOff, Search, Link, UploadCloud, Lock, Unlock, CheckCircle, XCircle, AlertTriangle, SquarePen } from "lucide-react";

// ── Toast component (giống OwnerBookingPage) ──
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
    <div className="fixed top-5 right-5 z-[60] animate-slide-in">
      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in { animation: slide-in 0.22s ease; }
      `}</style>
      <div className={`flex items-start gap-3 border rounded-2xl px-4 py-3.5 shadow-lg max-w-sm w-full ${s.bg}`}>
        {s.icon}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${s.title}`}>{toast.title}</p>
          {toast.message && <p className={`text-xs mt-0.5 ${s.msg}`}>{toast.message}</p>}
        </div>
        <button onClick={onClose} className={`shrink-0 transition ${s.close}`}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ── Confirm Modal ──
const ConfirmModal = ({ confirm, onCancel, onOk }) => {
  if (!confirm) return null;
  const styles = {
    lock:   { icon: <Lock className="w-8 h-8 text-red-400" />,       bg: "bg-red-50",     color: "bg-red-500 hover:bg-red-600",         label: "Khóa sân" },
    unlock: { icon: <Unlock className="w-8 h-8 text-emerald-400" />, bg: "bg-emerald-50", color: "bg-emerald-500 hover:bg-emerald-600", label: "Mở lại" },
  };
  const s = styles[confirm.type] || styles.lock;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-white rounded-2xl w-[360px] max-w-[95vw] shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-6 text-center">
          <div className={`w-16 h-16 ${s.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
            {s.icon}
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">{confirm.title}</h3>
          <p className="text-sm text-slate-500">{confirm.message}</p>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition">Huỷ</button>
          <button onClick={onOk} className={`flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition ${s.color}`}>{s.label}</button>
        </div>
      </div>
    </div>
  );
};

const OwnerCourtPage = () => {
  const [courts, setCourts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = (type, title, message = "") => setToast({ type, title, message });
  const hideToast = () => setToast(null);
  const showConfirm = (type, title, message, onOk) => setConfirm({ type, title, message, onOk });
  const hideConfirm = () => setConfirm(null);

  const [newCourt, setNewCourt] = useState({
    name: "", address: "", description: "", imageUrl: "", categoryId: "", seatNumber: 0,
  });

  const ownerId = 1;

  useEffect(() => {
    const loadCourts = async () => {
      try {
        const res = await authAPIs().get(endpoints["owner-courts"]);
        setCourts(res.data);
      } catch (err) { console.error("Error fetching courts:", err); }
    };
    const loadCategories = async () => {
      try {
        const res = await authAPIs().get(endpoints["categories"]);
        setCategories(res.data);
      } catch (err) { console.error("Error fetching categories:", err); }
    };
    loadCourts();
    loadCategories();
  }, []);

  const resetForm = () => {
    setNewCourt({ name: "", address: "", description: "", imageUrl: "", categoryId: "", seatNumber: 0 });
    setPreviewUrl("");
    setErrors({});
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCourt(null);
    resetForm();
  };

  const validate = () => {
    const e = {};
    if (!newCourt.name.trim())        e.name = true;
    if (!newCourt.address.trim())     e.address = true;
    if (!newCourt.description.trim()) e.description = true;
    if (!newCourt.categoryId)         e.categoryId = true;
    if (!newCourt.imageUrl && !newCourt.file) e.image = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmitCourt = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("court", new Blob([JSON.stringify({
        name: newCourt.name, address: newCourt.address, description: newCourt.description,
        categoryId: newCourt.categoryId, imageUrl: newCourt.imageUrl,
      })], { type: "application/json" }));
      if (newCourt.file) formData.append("file", newCourt.file);

      let res;
      if (editingCourt) {
        res = await authAPIs().put(`${endpoints["owner-courts"]}/${editingCourt.id}`, formData);
        setCourts(courts.map((c) => (c.id === editingCourt.id ? res.data : c)));
      } else {
        res = await authAPIs().post(endpoints["owner-courts"], formData);
        setCourts([...courts, res.data]);
      }
      setNewCourt({ ...newCourt, imageUrl: res.data.imageUrl });
      showToast("success", editingCourt ? "Cập nhật thành công!" : "Thêm sân thành công!", editingCourt ? "Thông tin sân đã được cập nhật." : "Sân mới đã được thêm vào danh sách.");
      closeModal();
    } catch (err) {
      console.error("Thao tác thất bại:", err);
      showToast("error", editingCourt ? "Cập nhật thất bại!" : "Thêm sân thất bại!", "Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (court) => {
    setEditingCourt(court);
    setNewCourt({
      name: court.name, address: court.address, description: court.description,
      imageUrl: court.imageUrl, categoryId: court.categoryId || "", seatNumber: court.seatNumber || 0,
    });
    setPreviewUrl(court.imageUrl || "");
    setShowModal(true);
  };

  const handleActivate = (id) => {
    showConfirm("unlock", "Mở lại sân?", "Sân sẽ được kích hoạt và hiển thị để đặt chỗ.", async () => {
      hideConfirm();
      setLoading(true);
      try {
        const res = await authAPIs().put(`${endpoints["owner-courts"]}/${id}/activate`);
        setCourts(courts.map((c) => (c.id === id ? res.data : c)));
        showToast("success", "Mở lại sân thành công!", "Sân đã được kích hoạt.");
      } catch (err) {
        console.error(err);
        showToast("error", "Thao tác thất bại", "Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    });
  };

  const handleDeactivate = (id) => {
    showConfirm("lock", "Khóa sân?", "Sân sẽ bị tạm ngưng và không thể đặt chỗ.", async () => {
      hideConfirm();
      setLoading(true);
      try {
        const res = await authAPIs().put(`${endpoints["owner-courts"]}/${id}/deactivate`);
        setCourts(courts.map((c) => (c.id === id ? res.data : c)));
        showToast("warning", "Đã khóa sân", "Sân đã bị tạm ngưng hoạt động.");
      } catch (err) {
        console.error(err);
        showToast("error", "Thao tác thất bại", "Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewCourt({ ...newCourt, file, imageUrl: "" });
    setPreviewUrl(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: false }));
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setNewCourt({ ...newCourt, imageUrl: url, file: null });
    setPreviewUrl(url);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (url) setErrors((prev) => ({ ...prev, image: false }));
  };

  const clearImage = () => {
    setNewCourt({ ...newCourt, imageUrl: "", file: null });
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const statusPriority = { REJECTED: 0, PENDING: 1, ACTIVE: 2 };

  const filteredCourts = courts
    .filter((c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.address?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => (statusPriority[a.status] ?? 99) - (statusPriority[b.status] ?? 99));

  const statusStyle = (status) => {
    if (!status) return "bg-slate-100 text-slate-400";
    const s = status.toLowerCase();
    if (s === "active")   return "bg-emerald-50 text-emerald-600";
    if (s === "pending")  return "bg-amber-50 text-amber-600";
    if (s === "rejected") return "bg-red-50 text-red-500";
    if (s === "inactive") return "bg-slate-100 text-slate-500";
    return "bg-slate-100 text-slate-400";
  };

  const inputCls = (errKey) =>
    `w-full px-3 py-2.5 text-sm border rounded-xl bg-slate-50 text-slate-800 placeholder-slate-400 outline-none transition ${
      errors[errKey]
        ? "border-red-400 bg-red-50 focus:border-red-400"
        : "border-slate-200 focus:border-emerald-400 focus:bg-white"
    }`;

  return (
    <>
      <Toast toast={toast} onClose={hideToast} />
      <ConfirmModal confirm={confirm} onCancel={hideConfirm} onOk={confirm?.onOk} />

      <div className="p-6">
        {/* TOOLBAR */}
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

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-100 bg-slate-50">
                {["ID", "Sân", "Hình ảnh", "Mô tả", "Loại sân", "Trạng thái", "Tính năng"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
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
                        <img src={court.imageUrl} alt={court.name} className="w-14 h-10 object-cover rounded-lg border border-slate-200" />
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
                          className="w-8 h-8 flex items-center justify-center rounded-lg transition bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white"
                          title="Sửa"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {court.status === "INACTIVE" ? (
                          <button
                            onClick={() => handleActivate(court.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition"
                            title="Mở lại sân"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                          </button>
                        ) : court.status === "ACTIVE" ? (
                          <button
                            onClick={() => handleDeactivate(court.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition"
                            title="Khóa sân"
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-white rounded-2xl w-[460px] max-w-[95vw] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${editingCourt ? "bg-blue-50" : "bg-emerald-50"}`}>
                  {editingCourt
                    ? <SquarePen className="w-4 h-4 text-blue-500" />
                    : <Plus className="w-4 h-4 text-emerald-500" />
                  }
                </div>
                <h2 className="text-base font-bold text-slate-800">
                  {editingCourt ? "Sửa thông tin sân" : "Thêm sân mới"}
                </h2>
              </div>
              <button onClick={closeModal} className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto">
              {[
                { key: "name",        label: "Tên sân",  placeholder: "VD: Sân bóng Thủ Đức",        errMsg: "Vui lòng nhập tên sân" },
                { key: "address",     label: "Địa chỉ",  placeholder: "VD: 123 Lê Văn Việt, TP.HCM", errMsg: "Vui lòng nhập địa chỉ" },
                { key: "description", label: "Mô tả",    placeholder: "Mô tả ngắn về sân...",         errMsg: "Vui lòng nhập mô tả" },
              ].map(({ key, label, placeholder, errMsg }) => (
                <div key={key}>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</p>
                  <input
                    type="text" placeholder={placeholder} className={inputCls(key)} value={newCourt[key]}
                    onChange={(e) => { setNewCourt({ ...newCourt, [key]: e.target.value }); if (e.target.value.trim()) setErrors((prev) => ({ ...prev, [key]: false })); }}
                  />
                  {errors[key] && (
                    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {errMsg}
                    </p>
                  )}
                </div>
              ))}

              {/* Image */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Hình ảnh</p>
                <div className="flex flex-col gap-2.5">
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text" placeholder="Nhập đường link hình ảnh..."
                      className={`w-full pl-9 pr-3 py-2.5 text-sm border rounded-xl placeholder-slate-400 outline-none transition ${errors.image ? "border-red-400 bg-red-50 focus:border-red-400" : "border-slate-200 bg-slate-50 focus:border-emerald-400 focus:bg-white"}`}
                      value={newCourt.imageUrl} onChange={handleUrlChange}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-xs text-slate-400 font-medium">hoặc chọn tệp</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>
                  <div
                    className={`relative border-2 border-dashed rounded-xl px-4 py-4 flex items-center gap-3 cursor-pointer transition group ${errors.image ? "border-red-300 bg-red-50 hover:border-red-400" : "border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40"}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition ${errors.image ? "bg-red-100" : "bg-slate-100 group-hover:bg-emerald-100"}`}>
                      <UploadCloud className={`w-4 h-4 transition ${errors.image ? "text-red-400" : "text-slate-400 group-hover:text-emerald-500"}`} />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium transition ${errors.image ? "text-red-400" : "text-slate-600 group-hover:text-emerald-600"}`}>
                        {newCourt.file ? newCourt.file.name : "Nhấn để chọn ảnh"}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, WEBP — tối đa 5MB</p>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </div>
                  {errors.image && (
                    <p className="text-red-400 text-xs flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Vui lòng cung cấp hình ảnh (link hoặc tệp)
                    </p>
                  )}
                  {previewUrl && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                      <img src={previewUrl} alt="preview" className="w-full h-36 object-cover" onError={() => setPreviewUrl("")} />
                      <button onClick={clearImage} className="absolute top-2 right-2 w-6 h-6 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full flex items-center justify-center transition">
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent px-3 py-2">
                        <p className="text-white text-xs font-medium truncate">{newCourt.file ? newCourt.file.name : "Ảnh từ URL"}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Loại sân */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Loại sân</p>
                <select
                  className={inputCls("categoryId")} value={newCourt.categoryId}
                  onChange={(e) => { setNewCourt({ ...newCourt, categoryId: e.target.value }); if (e.target.value) setErrors((prev) => ({ ...prev, categoryId: false })); }}
                >
                  <option value="">-- Chọn loại sân --</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.id} - {c.name}</option>)}
                </select>
                {errors.categoryId && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Vui lòng chọn loại sân
                  </p>
                )}
              </div>

              {/* Lý do từ chối */}
              {editingCourt?.status === "REJECTED" && editingCourt.rejectReason && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-red-600 mb-0.5">Lý do từ chối</p>
                    <p className="text-sm text-red-500">{editingCourt.rejectReason}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 shrink-0">
              <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
                Hủy
              </button>
              <button
                onClick={handleSubmitCourt} disabled={loading}
                className={`px-5 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow shadow-emerald-200 transition flex items-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : editingCourt ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {editingCourt ? "Cập nhật" : "Thêm sân"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OwnerCourtPage;