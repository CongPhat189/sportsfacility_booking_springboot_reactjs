import React, { useState, useEffect } from "react";
import { authAPIs, endpoints } from "../config/APIs";
import { Plus, Pencil, X, Search, Clock, Calendar, AlertTriangle } from "lucide-react";

const OwnerSchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [courts, setCourts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({});
  const [conflictError, setConflictError] = useState("");
  const [priceDisplay, setPriceDisplay] = useState("");

  const [form, setForm] = useState({
    courtId: "",
    dayOfWeek: 1,
    startTime: "",
    endTime: "",
    price: "",
    isActive: true,
  });

  useEffect(() => {
    loadSchedules();
    loadCourts();
  }, []);

  const payload = {
    courtId: Number(form.courtId),
    dayOfWeek: Number(form.dayOfWeek),
    startTime: form.startTime,
    endTime: form.endTime,
    price: Number(form.price),
    isActive: form.isActive,
  };

  const loadSchedules = async () => {
    try {
      const res = await authAPIs().get(endpoints["owner-schedules"]);
      setSchedules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCourts = async () => {
    try {
      const res = await authAPIs().get(endpoints["owner-courts"]);
      setCourts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setForm({ courtId: "", dayOfWeek: 1, startTime: "", endTime: "", price: "", isActive: true });
    setErrors({});
    setConflictError("");
    setPriceDisplay("");
  };

  const handlePriceInput = (raw) => {
    const digits = raw.replace(/\D/g, "");
    const formatted = digits ? Number(digits).toLocaleString("vi-VN") : "";
    setPriceDisplay(formatted);
    setForm((prev) => ({ ...prev, price: digits }));
    if (digits) setErrors((prev) => ({ ...prev, price: false }));
  };

  const validate = () => {
    const e = {};
    if (!form.courtId)   e.courtId = true;
    if (!form.startTime) e.startTime = true;
    if (!form.endTime)   e.endTime = true;
    if (!form.price)     e.price = true;

    if (form.startTime && form.endTime && form.endTime <= form.startTime) {
      e.endTime = true;
      e.timeOrder = true;
    }

    setErrors(e);
    setConflictError("");
    return Object.keys(e).filter(k => k !== "timeOrder").length === 0 && !e.timeOrder;
  };

  const checkConflict = () => {
    const conflict = schedules.find((s) => {
      if (editing && s.id === editing.id) return false;
      if (Number(s.courtId) !== Number(form.courtId)) return false;
      if (Number(s.dayOfWeek) !== Number(form.dayOfWeek)) return false;
      return form.startTime < s.endTime && s.startTime < form.endTime;
    });
    return conflict || null;
  };

  const handleAdd = async () => {
    if (!validate()) return;

    const conflict = checkConflict();
    if (conflict) {
      setConflictError(
        `Trùng lịch với khung giờ ${conflict.startTime} – ${conflict.endTime} (ID #${conflict.id})`
      );
      setErrors((prev) => ({ ...prev, startTime: true, endTime: true }));
      return;
    }

    try {
      const res = await authAPIs().post(endpoints["owner-schedules"], payload);
      setSchedules([...schedules, res.data]);
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409 || err.response?.status === 400) {
        setConflictError("Lịch này bị trùng với lịch đã tồn tại, vui lòng chọn khung giờ khác.");
        setErrors((prev) => ({ ...prev, startTime: true, endTime: true }));
      }
    }
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    const conflict = checkConflict();
    if (conflict) {
      setConflictError(
        `Trùng lịch với khung giờ ${conflict.startTime} – ${conflict.endTime} (ID #${conflict.id})`
      );
      setErrors((prev) => ({ ...prev, startTime: true, endTime: true }));
      return;
    }

    try {
      const res = await authAPIs().put(`${endpoints["owner-schedules"]}/${editing.id}`, payload);
      setSchedules(schedules.map((s) => (s.id === editing.id ? res.data : s)));
      setShowModal(false);
      setEditing(null);
      resetForm();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409 || err.response?.status === 400) {
        setConflictError("Lịch này bị trùng với lịch đã tồn tại, vui lòng chọn khung giờ khác.");
        setErrors((prev) => ({ ...prev, startTime: true, endTime: true }));
      }
    }
  };

  const handleEdit = (s) => {
    setEditing(s);
    setForm({
      courtId: s.courtId,
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
      price: s.price,
      isActive: s.isActive,
    });
    setPriceDisplay(s.price ? Number(s.price).toLocaleString("vi-VN") : "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    resetForm();
  };

  const dayMap = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

  const dayColor = (day) => {
    if (day === 0) return "bg-purple-50 text-purple-600";
    if (day === 6) return "bg-blue-50 text-blue-600";
    return "bg-slate-100 text-slate-600";
  };

  const filtered = schedules.filter(
    (s) =>
      dayMap[s.dayOfWeek]?.toLowerCase().includes(search.toLowerCase()) ||
      s.price?.toString().includes(search) ||
      s.courtName?.toLowerCase().includes(search.toLowerCase())
  );

  const formatPrice = (price) =>
    price ? Number(price).toLocaleString("vi-VN") + "₫" : "—";

  const inputCls = (errKey) =>
    `w-full px-3 py-2.5 text-sm border rounded-xl bg-slate-50 text-slate-800 outline-none transition ${
      errors[errKey]
        ? "border-red-400 bg-red-50 focus:border-red-400"
        : "border-slate-200 focus:border-emerald-400 focus:bg-white"
    }`;

  return (
    <div className="p-6">
      {/* ── TOOLBAR ── */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo sân, thứ, giá..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-400 focus:bg-white transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="text-sm text-slate-400">{filtered.length} lịch</span>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow shadow-emerald-200 transition"
        >
          <Plus className="w-4 h-4" />
          Thêm lịch
        </button>
      </div>

      {/* ── TABLE ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
  <thead>
    <tr className="border-b-2 border-slate-100 bg-slate-50">
      {["ID", "Sân", "Thứ", "Giờ hoạt động", "Giá", "Trạng thái", "Tính năng"].map((h) => (
        <th
          key={h}
          className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap text-center"
        >
          {h}
        </th>
      ))}
    </tr>
  </thead>
  <tbody>
    {filtered.length === 0 ? (
      <tr>
        <td colSpan={7} className="text-center py-16 text-slate-400">
          <div className="flex justify-center mb-3">
            <Calendar className="w-10 h-10 text-slate-300" />
          </div>
          <p className="font-semibold text-slate-500">Chưa có lịch nào</p>
          <p className="text-xs mt-1">Nhấn "Thêm lịch" để bắt đầu</p>
        </td>
      </tr>
    ) : (
      filtered.map((s) => (
        <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
          <td className="px-4 py-3.5 text-center">
            <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
              #{s.id}
            </span>
          </td>
          <td className="px-4 py-3.5 font-semibold text-slate-800 text-center">{s.courtName || "—"}</td>
          <td className="px-4 py-3.5 text-center">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${dayColor(s.dayOfWeek)}`}>
              {dayMap[s.dayOfWeek]}
            </span>
          </td>
          <td className="px-4 py-3.5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{s.startTime}</span>
              <span className="text-slate-300">→</span>
              <span>{s.endTime}</span>
            </div>
          </td>
          <td className="px-4 py-3.5 font-semibold text-slate-700 text-center">{formatPrice(s.price)}</td>
          <td className="px-4 py-3.5 text-center">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${s.isActive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
              {s.isActive ? "Hoạt động" : "Tạm nghỉ"}
            </span>
          </td>
          <td className="px-4 py-3.5 flex items-center justify-center">
            <button
              onClick={() => handleEdit(s)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition"
              title="Sửa"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
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
            className="bg-white rounded-2xl w-[420px] max-w-[95vw] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {editing
                  ? <Pencil className="w-4 h-4 text-slate-500" />
                  : <Plus className="w-4 h-4 text-slate-500" />
                }
                <h2 className="text-base font-bold text-slate-800">
                  {editing ? "Sửa lịch" : "Thêm lịch mới"}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 flex flex-col gap-4">

              {/* Chọn sân */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Sân</p>
                <select
                  className={inputCls("courtId")}
                  value={form.courtId}
                  onChange={(e) => {
                    setForm({ ...form, courtId: e.target.value });
                    if (e.target.value) setErrors((prev) => ({ ...prev, courtId: false }));
                    setConflictError("");
                  }}
                >
                  <option value="">-- Chọn sân --</option>
                  {courts.map((c) => (
                    <option key={c.id} value={c.id} disabled={c.status !== "ACTIVE"}>
                      {c.name}{c.status !== "ACTIVE" ? ` (${c.status === "INACTIVE" ? "Tạm nghỉ" : c.status})` : ""}
                    </option>
                  ))}
                </select>
                {errors.courtId && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Vui lòng chọn sân
                  </p>
                )}
              </div>

              {/* Thứ */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Thứ trong tuần</p>
                <select
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 outline-none focus:border-emerald-400 focus:bg-white transition"
                  value={form.dayOfWeek}
                  onChange={(e) => {
                    setForm({ ...form, dayOfWeek: e.target.value });
                    setConflictError("");
                    setErrors((prev) => ({ ...prev, startTime: false, endTime: false }));
                  }}
                >
                  {dayMap.map((d, i) => (
                    <option key={i} value={i}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Giờ bắt đầu / kết thúc */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Khung giờ</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Bắt đầu</p>
                    <input
                      type="time"
                      className={inputCls("startTime")}
                      value={form.startTime}
                      onChange={(e) => {
                        setForm({ ...form, startTime: e.target.value });
                        setErrors((prev) => ({ ...prev, startTime: false, timeOrder: false }));
                        setConflictError("");
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Kết thúc</p>
                    <input
                      type="time"
                      className={inputCls("endTime")}
                      value={form.endTime}
                      onChange={(e) => {
                        setForm({ ...form, endTime: e.target.value });
                        setErrors((prev) => ({ ...prev, endTime: false, timeOrder: false }));
                        setConflictError("");
                      }}
                    />
                  </div>
                </div>

                {/* Lỗi giờ */}
                {(errors.startTime || errors.endTime) && !conflictError && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />{" "}
                    {errors.timeOrder
                      ? "Giờ kết thúc phải sau giờ bắt đầu"
                      : "Vui lòng chọn đầy đủ giờ bắt đầu và kết thúc"}
                  </p>
                )}

                {/* Lỗi trùng lịch */}
                {conflictError && (
                  <div className="mt-2 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-red-600">Trùng lịch</p>
                      <p className="text-xs text-red-500 mt-0.5">{conflictError}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Giá */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Giá (VNĐ)</p>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="VD: 150.000"
                    className={`${inputCls("price")} pr-10`}
                    value={priceDisplay}
                    onChange={(e) => handlePriceInput(e.target.value)}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">₫</span>
                </div>
                {errors.price && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Vui lòng nhập giá
                  </p>
                )}
              </div>

              {/* Trạng thái */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Trạng thái hoạt động</p>
                  <p className="text-xs text-slate-400 mt-0.5">Lịch này có hiển thị để đặt không?</p>
                </div>
                <button
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.isActive ? "bg-emerald-500" : "bg-slate-300"}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${form.isActive ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={editing ? handleUpdate : handleAdd}
                className="px-5 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow shadow-emerald-200 transition"
              >
                {editing ? "Cập nhật" : "Thêm lịch"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerSchedulePage;