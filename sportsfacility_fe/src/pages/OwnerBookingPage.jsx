import React, { useState, useEffect } from "react";
import { authAPIs, endpoints } from "../config/APIs";

const OwnerCourtPage = () => {
  const [courts, setCourts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null); // sân đang sửa
  const [newCourt, setNewCourt] = useState({
    name: "",
    address: "",
    description: "",
    imageUrl: "",
    categoryName: "",
    seatNumber: 0,
  });

  const ownerId = 1;

  // Load sân
  useEffect(() => {
    const loadCourts = async () => {
      try {
        const res = await authAPIs().get(endpoints["owner-courts"]);
        setCourts(res.data);
      } catch (err) {
        console.error("Error fetching courts:", err);
      }
    };
    loadCourts();
  }, []);

  // Thêm sân
  const handleAddCourt = async () => {
    try {
      const courtData = {
        ownerId,
        categoryId: 1,
        ...newCourt,
      };

      const res = await authAPIs().post(endpoints["owner-courts"], courtData);
      setCourts([...courts, res.data]);
      setShowModal(false);
      setNewCourt({ name: "", address: "", description: "", imageUrl: "", categoryName: "", seatNumber: 0 });
      alert("Thêm sân thành công!");
    } catch (err) {
      console.error("Lỗi khi thêm sân:", err);
      alert("Thêm sân thất bại!");
    }
  };

  // Mở modal để sửa sân
  const handleEdit = (court) => {
    setEditingCourt(court); // lưu sân đang sửa
    setNewCourt({
      name: court.name,
      address: court.address,
      description: court.description,
      imageUrl: court.imageUrl,
      categoryName: court.categoryName || "",
      seatNumber: court.seatNumber || 0,
    });
    setShowModal(true);
  };

  // Cập nhật sân
  const handleUpdateCourt = async () => {
    try {
      const courtData = {
        ownerId,
        categoryId: 1,
        ...newCourt,
      };
      const res = await authAPIs().put(`${endpoints["owner-courts"]}/${editingCourt.id}`, courtData);

      setCourts(courts.map(c => c.id === editingCourt.id ? res.data : c));
      setShowModal(false);
      setEditingCourt(null);
      setNewCourt({ name: "", address: "", description: "", imageUrl: "", categoryName: "", seatNumber: 0 });
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
      setCourts(courts.filter(c => c.id !== id));
      alert("Xóa thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa sân:", err);
      alert("Xóa thất bại!");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Quản lý Sân</h1>

      <div className="overflow-x-auto shadow rounded bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr className="text-center">
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Tên sân</th>
              <th className="border px-2 py-1">Địa chỉ</th>
              <th className="border px-2 py-1">Mô tả</th>
              <th className="border px-2 py-1">Hình ảnh</th>
              <th className="border px-2 py-1">Loại sân</th>
              <th className="border px-2 py-1">Trạng thái</th>
              <th className="border px-2 py-1">Tính năng</th>
            </tr>
          </thead>
          <tbody>
            {courts.map(court => (
              <tr key={court.id} className="text-center">
                <td className="border px-2 py-1">{court.id}</td>
                <td className="border px-2 py-1">{court.name}</td>
                <td className="border px-2 py-1">{court.address}</td>
                <td className="border px-2 py-1">{court.description}</td>
                <td className="border px-2 py-1">
                  {court.imageUrl && <img src={court.imageUrl} alt={court.name} className="w-20 mx-auto" />}
                </td>
                <td className="border px-2 py-1">{court.categoryName}</td>
                <td className="border px-2 py-1">{court.status}</td>
                <td className="border px-2 py-1 space-x-2">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onClick={() => handleEdit(court)}>Sửa</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => handleDelete(court.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-start">
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={() => setShowModal(true)}>Thêm sân</button>
        </div>
      </div>

      {/* Modal Thêm/Sửa sân */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-200 bg-opacity-40" onClick={() => { setShowModal(false); setEditingCourt(null); }}></div>

          <div className="bg-white p-6 rounded shadow-lg w-96 z-10">
            <h2 className="text-lg font-bold mb-4">{editingCourt ? "Sửa Sân" : "Thêm Sân Mới"}</h2>

            <input type="text" placeholder="Tên sân" className="border w-full px-2 py-1 mb-2 rounded" value={newCourt.name} onChange={e => setNewCourt({ ...newCourt, name: e.target.value })} />
            <input type="text" placeholder="Địa chỉ" className="border w-full px-2 py-1 mb-2 rounded" value={newCourt.address} onChange={e => setNewCourt({ ...newCourt, address: e.target.value })} />
            <input type="text" placeholder="Mô tả" className="border w-full px-2 py-1 mb-2 rounded" value={newCourt.description} onChange={e => setNewCourt({ ...newCourt, description: e.target.value })} />
            <input type="text" placeholder="URL Hình ảnh" className="border w-full px-2 py-1 mb-2 rounded" value={newCourt.imageUrl} onChange={e => setNewCourt({ ...newCourt, imageUrl: e.target.value })} />
            <input type="text" placeholder="Loại sân" className="border w-full px-2 py-1 mb-2 rounded" value={newCourt.categoryName} onChange={e => setNewCourt({ ...newCourt, categoryName: e.target.value })} />

            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400" onClick={() => { setShowModal(false); setEditingCourt(null); }}>Hủy</button>
              <button className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600" onClick={editingCourt ? handleUpdateCourt : handleAddCourt}>{editingCourt ? "Cập nhật" : "Thêm"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerCourtPage;