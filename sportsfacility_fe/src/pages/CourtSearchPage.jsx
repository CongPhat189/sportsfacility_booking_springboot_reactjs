import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import axios, { endpoints, authAPIs } from '../config/APIs'
import { toast } from 'react-toastify'

export default function CourtSearchPage() {
  const [keyword, setKeyword] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState([])
  const [courts, setCourts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false) 
  const [selectedCourt, setSelectedCourt] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [note, setNote] = useState('')
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [booking, setBooking] = useState(false)
  const today = new Date().toISOString().split('T')[0]
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleSearch = async (e, overrideCategoryId) => {
    e?.preventDefault()
    setLoading(true)
    try {
      const res = await axios.get(endpoints['courts-search'], {
        params: {
          keyword: keyword || undefined,
          categoryId: (overrideCategoryId !== undefined ? overrideCategoryId : categoryId) || undefined
        }
      })
      setCourts(res.data)
    } catch {
      setCourts([])
    } finally {
      setLoading(false)
    }
  }

  const openModal = (court) => {
    if (!user) { navigate('/login'); return }
    setSelectedCourt(court)
    setSelectedDate(today)
    setSlots([])
    setSelectedSlot(null)
    setNote('')
    setShowModal(true)
  }

  const fetchSlots = async (courtId, date) => {
    if(!date) return
    setSlotsLoading(true)
    try {
      const res = await authAPIs().get(endpoints['available-slots'](courtId), {
        params: { date }
      
      })
      setSlots(res.data)
    } catch {
      setSlots([])
      toast.error('Không thể tải lịch trống')
    } finally {
      setSlotsLoading(false)
    }
  }

  const handleBooking = async () => {
    if (!selectedSlot || !selectedDate) return
    setBooking(true)
    try {
      const bookingRes = await authAPIs().post(endpoints['create-booking'], {
        courtId: selectedCourt.id,
        scheduleId: selectedSlot.id,
        date: selectedDate,
        note: note || null
      })
      const payRes = await authAPIs().post(endpoints['vnpay-create'], {
        bookingId: bookingRes.data.id,
      })
      window.location.href = payRes.data.paymentUrl
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || 'Đặt sân thất bại')
      setBooking(false)
    }
  }

  useEffect(() => {
    axios.get(endpoints['categories'])
      .then(res => setCategories(res.data))
      .catch(() => {})
    handleSearch()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(null, categoryId)
    }, 500)
    return () => clearTimeout(timer)
  }, [keyword])

  useEffect(() => {
    if (showModal && selectedCourt && selectedDate) {
      fetchSlots(selectedCourt.id, selectedDate)
    }
  }, [selectedDate, showModal])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">SportBook</h1>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">Xin chào, {user.fullName}</span>
              <button
                onClick={() => navigate('/my-bookings')}
                className="text-sm text-blue-600 hover:underline"
              >
                Lịch đặt sân
              </button>
              <button
                onClick={logout}
                className="text-sm text-red-500 hover:underline"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-8 px-4">
        {/* Search form */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <input
            type="text" placeholder="Tìm kiếm sân..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
          <select
            className="border rounded-lg px-3 py-2"
            value={categoryId}
            onChange={e => { setCategoryId(e.target.value); handleSearch(null, e.target.value) }}
          >
            <option value="">Tất cả loại sân</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Tìm
          </button>
        </form>

        {/* Court list */}
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Đang tải...</p>
        ) : courts.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Không tìm thấy sân nào</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courts.map(court => (
              <div key={court.id}
                onClick={() => openModal(court)}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <img
                  src={court.imageUrl || 'https://placehold.co/400x200?text=No+Image'}
                  alt={court.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {court.categoryName}
                  </span>
                  <h3 className="font-semibold mt-2">{court.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{court.address}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
            {/* Booking Modal */}
      {showModal && selectedCourt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold">{selectedCourt.name}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <div className="p-5 space-y-4">
              {/* Chọn ngày */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Chọn ngày</label>
                <input
                  type="date" min={today} value={selectedDate}
                  onChange={e => { setSelectedDate(e.target.value); setSelectedSlot(null) }}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Danh sách slot */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Chọn khung giờ</label>
                {slotsLoading ? (
                  <p className="text-sm text-gray-500">Đang tải...</p>
                ) : slots.length === 0 ? (
                  <p className="text-sm text-gray-500">Không có khung giờ trống</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {slots.map(slot => (
                      <button key={slot.id} onClick={() => setSelectedSlot(slot)}
                        className={`border rounded-lg p-3 text-sm text-left transition-colors ${
                          selectedSlot?.id === slot.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'hover:border-blue-300 hover:bg-gray-50'
                        }`}>
                        <div className="font-medium">{slot.startTime} - {slot.endTime}</div>
                        <div className="text-blue-600 mt-0.5">{slot.price?.toLocaleString('vi-VN')}đ</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Ghi chú */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Ghi chú (tuỳ chọn)</label>
                <textarea rows={2} placeholder="Yêu cầu đặc biệt..."
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={note} onChange={e => setNote(e.target.value)} />
              </div>

              {/* Tóm tắt */}
              {selectedSlot && (
                <div className="bg-blue-50 rounded-lg p-3 text-sm space-y-1">
                  <p><span className="font-medium">Sân:</span> {selectedCourt.name}</p>
                  <p><span className="font-medium">Ngày:</span> {new Date(selectedDate).toLocaleDateString('vi-VN')}</p>
                  <p><span className="font-medium">Giờ:</span> {selectedSlot.startTime} - {selectedSlot.endTime}</p>
                  <p><span className="font-medium">Tiền cọc (50%):</span> {(selectedSlot.price / 2).toLocaleString('vi-VN')}đ</p>
                </div>
              )}

              {/* Nút đặt sân */}
              <button disabled={!selectedSlot || booking} onClick={handleBooking}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium">
                {booking ? 'Đang xử lý...' : 'Đặt sân & Thanh toán'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
    
  )
}
