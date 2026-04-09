import React, { useState, useEffect, useRef } from "react";
import { authAPIs, endpoints } from "../config/APIs";
import { Plus, Pencil, X, ImageOff, Search, Link, UploadCloud, Lock, Unlock, CheckCircle, XCircle, AlertTriangle, SquarePen } from "lucide-react";

// ── Toast component ──
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
    lock:   { icon: <Lock className="w-8 h-8 text-red-400" />,      bg: "bg-red-50",    color: "bg-red-500 hover:bg-red-600",        label: "Khóa sân" },
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
  const [previewUrls, setPreviewUrls] = useState([]); // Chuyển thành mảng để xem nhiều ảnh
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const fileInputRef = useRef(null);

  const [newCourt, setNewCourt] = useState({
    name: "", address: "", description: "", imageUrl: "", categoryId: "", files: []
  });

  const showToast = (type, title, message = "") => setToast({ type, title, message });
  const hideToast = () => setToast(null);
  const showConfirm = (type, title, message, onOk) => setConfirm({ type, title, message, onOk });
  const hideConfirm = () => setConfirm(null);

  useEffect(() => {
    loadCourts();
    loadCategories();
  }, []);

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

  const resetForm = () => {
    setNewCourt({ name: "", address: "", description: "", imageUrl: "", categoryId: "", files: [] });
    setPreviewUrls([]);
    setErrors({});
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCourt(null);
    resetForm();
  };

  const validate = () => {
    const e = {};
    if (!newCourt.name.trim()) e.name = true;
    if (!newCourt.address.trim()) e.address = true;
    if (!newCourt.description.trim()) e.description = true;
    if (!newCourt.categoryId) e.categoryId = true;
    // Kiểm tra có ít nhất 1 link hoặc 1 file
    if (!newCourt.imageUrl && (!newCourt.files || newCourt.files.length === 0)) e.image = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmitCourt = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      // Gửi từng field lẻ để Backend @ModelAttribute tự map
      formData.append("name", newCourt.name);
      formData.append("address", newCourt.address);
      formData.append("description", newCourt.description);
      formData.append("categoryId", newCourt.categoryId);
      formData.append("imageUrl", newCourt.imageUrl);

      // Thêm tối đa 3 file ảnh vào key "imageFiles"
      if (newCourt.files && newCourt.files.length > 0) {
        newCourt.files.forEach((file) => {
          formData.append("imageFiles", file); 
        });
      }

      let res;
      if (editingCourt) {
        res = await authAPIs().put(`${endpoints["owner-courts"]}/${editingCourt.id}`, formData);
        setCourts(courts.map((c) => (c.id === editingCourt.id ? res.data : c)));
      } else {
        res = await authAPIs().post(endpoints["owner-courts"], formData);
        setCourts([...courts, res.data]);
      }
      
      showToast("success", editingCourt ? "Cập nhật thành công!" : "Thêm sân thành công!");
      closeModal();
    } catch (err) {
      console.error(err);
      showToast("error", "Thao tác thất bại!", "Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (court) => {
    setEditingCourt(court);
    setNewCourt({
      name: court.name,
      address: court.address,
      description: court.description,
      imageUrl: court.imageUrl,
      categoryId: court.categoryId || "",
      files: []
    });
    // Nếu có chuỗi link "link1,link2", cắt ra để preview
    setPreviewUrls(court.imageUrl ? court.imageUrl.split(",") : []);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    // Giới hạn 3 file
    const limitedFiles = selectedFiles.slice(0, 3);
    setNewCourt({ ...newCourt, files: limitedFiles, imageUrl: "" });

    // Tạo preview
    const urls = limitedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    setErrors((prev) => ({ ...prev, image: false }));
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setNewCourt({ ...newCourt, imageUrl: url, files: [] });
    setPreviewUrls(url ? url.split(",") : []);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (url) setErrors((prev) => ({ ...prev, image: false }));
  };

  const clearImage = (index) => {
    const newFiles = [...newCourt.files];
    const newPreviews = [...previewUrls];
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setNewCourt({ ...newCourt, files: newFiles });
    setPreviewUrls(newPreviews);
    if (newPreviews.length === 0 && fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleActivate = (id) => {
    showConfirm("unlock", "Mở lại sân?", "Sân sẽ được kích hoạt.", async () => {
      hideConfirm();
      setLoading(true);
      try {
        const res = await authAPIs().put(`${endpoints["owner-courts"]}/${id}/activate`);
        setCourts(courts.map((c) => (c.id === id ? res.data : c)));
        showToast("success", "Thành công", "Sân đã được kích hoạt.");
      } catch (err) { showToast("error", "Lỗi", "Không thể kích hoạt sân."); }
      finally { setLoading(false); }
    });
  };

  const handleDeactivate = (id) => {
    showConfirm("lock", "Khóa sân?", "Sân sẽ bị tạm ngưng.", async () => {
      hideConfirm();
      setLoading(true);
      try {
        const res = await authAPIs().put(`${endpoints["owner-courts"]}/${id}/deactivate`);
        setCourts(courts.map((c) => (c.id === id ? res.data : c)));
        showToast("warning", "Đã khóa", "Sân đã tạm ngưng.");
      } catch (err) { showToast("error", "Lỗi", "Không thể khóa sân."); }
      finally { setLoading(false); }
    });
  };

  const filteredCourts = courts.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.address?.toLowerCase().includes(search.toLowerCase())
  );

  const statusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === "active")   return "bg-emerald-50 text-emerald-600";
    if (s === "pending")  return "bg-amber-50 text-amber-600";
    if (s === "rejected") return "bg-red-50 text-red-500";
    return "bg-slate-100 text-slate-500";
  };

  const inputCls = (errKey) =>
    `w-full px-3 py-2.5 text-sm border rounded-xl bg-slate-50 outline-none transition ${
      errors[errKey] ? "border-red-400 bg-red-50" : "border-slate-200 focus:border-emerald-400 focus:bg-white"
    }`;

  return (
    <>
      <Toast toast={toast} onClose={hideToast} />
      <ConfirmModal confirm={confirm} onCancel={hideConfirm} onOk={confirm?.onOk} />

      <div className="p-6">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text" placeholder="Tìm sân..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-emerald-400 focus:bg-white"
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Thêm sân
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {["ID", "Sân", "Hình ảnh", "Loại", "Trạng thái", "Thao tác"].map((h) => (
                  <th key={h} className="text-left px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCourts.map((court) => (
                <tr key={court.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                  <td className="px-4 py-4 font-mono text-xs text-slate-400">#{court.id}</td>
                  <td className="px-4 py-4">
                    <p className="font-bold text-slate-800">{court.name}</p>
                    <p className="text-xs text-slate-400 truncate max-w-[200px]">{court.address}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex -space-x-3 overflow-hidden">
                      {court.imageUrl ? court.imageUrl.split(",").slice(0, 3).map((img, i) => (
                        <img key={i} src={img} className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover bg-slate-100" />
                      )) : <ImageOff className="w-5 h-5 text-slate-300" />}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-500 text-xs">{court.categoryName}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${statusStyle(court.status)}`}>
                      {court.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(court)} className="p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      {court.status === "ACTIVE" ? (
                        <button onClick={() => handleDeactivate(court.id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition">
                          <Lock className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button onClick={() => handleActivate(court.id)} className="p-2 rounded-lg bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white transition">
                          <Unlock className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-white rounded-3xl w-[480px] max-w-[95vw] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">{editingCourt ? "Sửa sân" : "Thêm sân mới"}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full transition"><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">Tên sân & Địa chỉ</label>
                <input type="text" placeholder="Tên sân" className={inputCls("name")} value={newCourt.name} onChange={(e) => setNewCourt({...newCourt, name: e.target.value})} />
                <input type="text" placeholder="Địa chỉ" className={`${inputCls("address")} mt-2`} value={newCourt.address} onChange={(e) => setNewCourt({...newCourt, address: e.target.value})} />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">Mô tả</label>
                <textarea className={`${inputCls("description")} min-h-[80px]`} placeholder="Thông tin chi tiết..." value={newCourt.description} onChange={(e) => setNewCourt({...newCourt, description: e.target.value})} />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">Hình ảnh (Tối đa 3)</label>
                <div 
                  className={`border-2 border-dashed rounded-2xl p-4 transition cursor-pointer hover:bg-emerald-50/50 ${errors.image ? "border-red-200 bg-red-50" : "border-slate-200"}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600"><UploadCloud className="w-5 h-5" /></div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">Chọn ảnh từ máy</p>
                      <p className="text-[10px] text-slate-400">Hỗ trợ PNG, JPG (Tối đa 3 file)</p>
                    </div>
                  </div>
                  <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>
                
                <div className="flex items-center gap-2 my-3">
                  <div className="flex-1 h-px bg-slate-100"></div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Hoặc link URL</span>
                  <div className="flex-1 h-px bg-slate-100"></div>
                </div>

                <input type="text" placeholder="Dán link ảnh (cách nhau bằng dấu phẩy)" className={inputCls("image")} value={newCourt.imageUrl} onChange={handleUrlChange} />

                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {previewUrls.map((url, i) => (
                      <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        <img src={url} className="w-full h-full object-cover" />
                        <button onClick={() => clearImage(i)} className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">Loại sân</label>
                <select className={inputCls("categoryId")} value={newCourt.categoryId} onChange={(e) => setNewCourt({...newCourt, categoryId: e.target.value})}>
                  <option value="">Chọn loại sân</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-slate-50 flex gap-3">
              <button onClick={closeModal} className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition">Hủy</button>
              <button 
                onClick={handleSubmitCourt} 
                disabled={loading}
                className="flex-[2] py-3 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Đang xử lý..." : editingCourt ? "Cập nhật ngay" : "Tạo sân mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OwnerCourtPage;