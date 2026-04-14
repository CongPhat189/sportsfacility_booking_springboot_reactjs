import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios, { endpoints, authAPIs } from '../config/APIs'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthProvider'

import { Map, MapPin, ChevronLeft, ChevronRight, Wifi, Car, Droplets, Bath, CircleDot, Shirt, Heart } from 'lucide-react'

export default function CourtDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [court, setCourt] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const today = new Date().toISOString().split('T')[0]
  const [calendarDate, setCalendarDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(today)
  const [selectedSlot, setSelectedSlot] = useState(null)

  const [slots, setSlots] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [note, setNote] = useState('')
  const [booking, setBooking] = useState(false)
  const amenities = [
    { icon: <Wifi className="w-4 h-4" />, label: 'WiFi miễn phí' },
    { icon: <Car className="w-4 h-4" />, label: 'Bãi đỗ xe rộng' },
    { icon: <Droplets className="w-4 h-4" />, label: 'Nước uống miễn phí' },
    { icon: <Bath className="w-4 h-4" />, label: 'Phòng tắm' },
  ]

  const services = [
    { icon: <CircleDot className="w-7 h-7" />, label: 'Cho thuê dụng cụ', desc: 'Dụng cụ thi đấu tiêu chuẩn cho mọi môn thể thao.' },
    { icon: <Shirt className="w-7 h-7" />, label: 'Cho thuê áo bib', desc: 'Hỗ trợ phân chia đội hình với bộ áo tập nhiều màu sắc.' },
    { icon: <Heart className="w-7 h-7" />, label: 'Sơ cứu y tế', desc: 'Luôn sẵn sàng bộ dụng cụ y tế cơ bản cho các tình huống cần thiết.' },
  ]

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot)
    setStartTime(slot.startTime.substring(0, 5))
    setEndTime(slot.endTime.substring(0, 5))
  }

  const matchingSlot = slots.find(s => {
    const slotStart = s.startTime.substring(0, 5)
    const slotEnd = s.endTime.substring(0, 5)
    return slotStart <= startTime && slotEnd >= endTime && startTime < endTime
  })
  const durationHours = (matchingSlot && startTime && endTime)
    ? (new Date(`2000-01-01T${endTime}`) - new Date(`2000-01-01T${startTime}`)) / 3600000 : 0
  const totalAmount = matchingSlot ? durationHours * matchingSlot.price : 0
  const depositAmount = totalAmount * 0.5
  const hasConflict = startTime && endTime && slots.some(s =>
    s.bookedRanges?.some(r =>
      startTime < r.endTime.substring(0, 5) && endTime > r.startTime.substring(0, 5)
    )
  )
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null
  const DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate()
  const getFirstDay = (y, m) => new Date(y, m, 1).getDay()
  const prevMonth = () => setCalendarDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const nextMonth = () => setCalendarDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))

  const handleDayClick = (day) => {
    const y = calendarDate.getFullYear()
    const m = String(calendarDate.getMonth() + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    const dateStr = `${y}-${m}-${d}`
    if (dateStr >= today) setSelectedDate(dateStr)
  }
  useEffect(() => {
    Promise.all([
      axios.get(endpoints['court-detail'](id)),
      axios.get(endpoints['court-reviews'](id))
    ]).then(([courtRes, reviewsRes]) => {
      setCourt(courtRes.data)
      setReviews(reviewsRes.data)
    }).catch(() => toast.error('Không thể tải thông tin sân'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!id || !selectedDate) return
    const fetchSlots = async () => {
      setSlotsLoading(true)
      setStartTime('')
      setEndTime('')
      try {
        const res = await axios.get(endpoints['available-slots'](id), { params: { date: selectedDate } })
        setSlots(res.data)
      } catch {
        setSlots([])
      } finally {
        setSlotsLoading(false)
      }
    }
    fetchSlots()
  }, [selectedDate, id])


  const handleBooking = async () => {
    if (!user) { navigate('/login'); return }
    if (!matchingSlot || durationHours <= 0) {
      toast.error('Vui lòng chọn khoảng giờ hợp lệ')
      return
    }
    setBooking(true)
    try {
      const bookingRes = await authAPIs().post(endpoints['create-booking'], {
        courtId: Number(id),
        date: selectedDate,
        startTime: startTime + ':00',
        endTime: endTime + ':00',
        note: note || null
      })
      const payRes = await authAPIs().post(endpoints['vnpay-create'], {
        bookingId: bookingRes.data.id
      })
      window.location.href = payRes.data.paymentUrl
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || 'Đặt sân thất bại')
      setBooking(false)
    }
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {loading ? (
        <div className="flex items-center justify-center py-40 text-gray-400">Đang tải...</div>
      ) : !court ? (
        <div className="flex items-center justify-center py-40 text-gray-400">Không tìm thấy sân</div>
      ) : (
        <div className="max-w-6xl mx-auto px-6 py-8">
          <button onClick={() => navigate('/courts')}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 mb-6">
            <ChevronLeft className="w-4 h-4" /> Quay lại danh sách sân
          </button>
          {/* Image Gallery */}
          <div className="relative h-[420px] mb-4 overflow-hidden rounded-2xl">
            <img
              src={court.imageUrl || 'https://placehold.co/1200x420?text=No+Image'}
              alt={court.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h1 className="text-3xl font-black">{court.name}</h1>
              <p className="flex items-center gap-1 text-sm mt-1 opacity-90">
                <MapPin className="w-3.5 h-3.5" /> {court.address}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(court.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 flex items-center gap-1 underline hover:text-green-300"
                  title="Xem trên Google Maps"
                >
                  <Map className="w-3.5 h-3.5" /> Xem bản đồ
                </a>
              </p>
            </div>
            {avgRating && (
              <div className="absolute bottom-4 right-4 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                ★ {avgRating}
              </div>
            )}
          </div>
          {/* Amenities */}
          <div className="flex gap-6 py-4 border-b mb-8">
            {amenities.map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-green-600">{a.icon}</span> {a.label}
              </div>
            ))}
          </div>

          {/* 2 cột: trái = info, phải = booking */}
          <div className="flex gap-8 items-start">

            {/* ===== CỘT TRÁI ===== */}
            <div className="flex-1 min-w-0">

              {/* Mô tả */}
              {court.description && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">Mô tả sân</h2>
                  <p className="text-gray-600 leading-relaxed">{court.description}</p>
                </div>
              )}

              {/* Tiện ích đi kèm */}
              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Tiện ích đi kèm</h2>
                <div className="grid grid-cols-3 gap-4">
                  {services.map((s, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-4">
                      <span className="text-green-600 mb-2 block">{s.icon}</span>
                      <p className="font-semibold text-sm mb-1">{s.label}</p>
                      <p className="text-xs text-gray-500">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Đánh giá */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Đánh giá từ cộng đồng</h2>
                {reviews.length === 0 ? (
                  <p className="text-gray-400">Chưa có đánh giá nào.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {reviews.map(r => (
                      <div key={r.id} className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                              {r.customerName?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{r.customerName}</p>
                              <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('vi-VN')}</p>
                            </div>
                          </div>
                          <span className="text-yellow-400 text-sm">{'★'.repeat(r.rating)}</span>
                        </div>
                        {r.comment && <p className="text-gray-600 text-sm mt-2">{r.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* ===== CỘT PHẢI — Booking Widget ===== */}
            <div className="w-[380px] flex-shrink-0 sticky top-24 self-start">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Đặt sân ngay</h3>

                {/* Calendar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-sm">
                      Tháng {calendarDate.getMonth() + 1}, {calendarDate.getFullYear()}
                    </span>
                    <div className="flex gap-1">
                      <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-1">
                    {DAYS.map(d => <span key={d}>{d}</span>)}
                  </div>
                  <div className="grid grid-cols-7 text-center gap-y-1">
                    {Array(getFirstDay(calendarDate.getFullYear(), calendarDate.getMonth())).fill(null).map((_, i) => (
                      <span key={i} />
                    ))}
                    {Array(getDaysInMonth(calendarDate.getFullYear(), calendarDate.getMonth())).fill(null).map((_, i) => {
                      const day = i + 1
                      const y = calendarDate.getFullYear()
                      const m = String(calendarDate.getMonth() + 1).padStart(2, '0')
                      const dateStr = `${y}-${m}-${String(day).padStart(2, '0')}`
                      const isPast = dateStr < today
                      const isSelected = dateStr === selectedDate
                      return (
                        <button key={day} onClick={() => !isPast && handleDayClick(day)}
                          disabled={isPast}
                          className={`w-8 h-8 mx-auto rounded-full text-sm font-medium transition
                            ${isSelected ? 'bg-green-500 text-white' : ''}
                            ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-green-100 text-gray-700'}
                          `}>
                          {day}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Bảng giá khung giờ */}
                {slotsLoading ? (
                  <p className="text-sm text-gray-400 mb-4">Đang tải khung giờ...</p>
                ) : slots.length > 0 ? (
                  <div className="mb-4 space-y-2">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Chọn khung giờ</p>
                    {slots.map(s => (
                      <div key={s.id}
                        onClick={() => handleSlotClick(s)}
                        className={`rounded-xl p-3 border-2 cursor-pointer transition
                          ${selectedSlot?.id === s.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                        <div className="flex justify-between text-sm font-semibold">
                          <span>{s.startTime.substring(0, 5)} - {s.endTime.substring(0, 5)}</span>
                          <span className="text-green-600">{s.price?.toLocaleString('vi-VN')}đ/giờ</span>
                        </div>
                        {s.bookedRanges?.length > 0 ? (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {s.bookedRanges.map((r, i) => (
                              <span key={i} className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                                ⛔ {r.startTime.substring(0, 5)} - {r.endTime.substring(0, 5)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-green-600 mt-1">✅ Còn trống hoàn toàn</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 mb-4">Không có khung giờ cho ngày này</p>
                )}

                {/* Chọn giờ */}
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Chọn thời gian</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Giờ bắt đầu</label>
                    <input type="time" step="1800" value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                      className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Giờ kết thúc</label>
                    <input type="time" step="1800" value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                      className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                  </div>
                </div>

                {startTime && endTime && !matchingSlot && (
                  <p className="text-red-500 text-xs mb-3">⚠ Khoảng giờ không hợp lệ.</p>
                )}
                {hasConflict && matchingSlot && (
                  <p className="text-red-500 text-xs mb-3">⚠ Khoảng giờ này trùng với lịch đã đặt.</p>
                )}

                {/* Tóm tắt giá */}
                {matchingSlot && durationHours > 0 && (
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between text-gray-600"><span>Thời lượng</span><span>{durationHours} giờ</span></div>
                    <div className="flex justify-between text-gray-600"><span>Đơn giá</span><span>{matchingSlot.price?.toLocaleString('vi-VN')}đ / giờ</span></div>
                    <div className="flex justify-between text-gray-600"><span>Tiền cọc</span><span>{depositAmount.toLocaleString('vi-VN')}đ</span></div>
                    <div className="flex justify-between font-black text-xl border-t pt-2">
                      <span>Tổng cộng</span>
                      <span className="text-green-600">{totalAmount.toLocaleString('vi-VN')}đ</span>
                    </div>
                  </div>
                )}

                <textarea rows={2} placeholder="Ghi chú (tuỳ chọn)..."
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
                  value={note} onChange={e => setNote(e.target.value)} />

                <button
                  disabled={!matchingSlot || durationHours <= 0 || booking || hasConflict}
                  onClick={handleBooking}
                  className="w-full bg-green-500 text-white py-3 rounded-xl font-bold text-base hover:bg-green-600 disabled:opacity-50 transition">
                  {booking ? 'Đang xử lý...' : 'Đặt sân ngay'}
                </button>
                {matchingSlot && durationHours > 0 && (
                  <p className="text-xs text-blue-500 text-center mt-2">
                    💳 Bạn sẽ thanh toán <strong>{depositAmount.toLocaleString('vi-VN')}đ</strong> tiền cọc ngay bây giờ.
                    Phần còn lại thanh toán tại sân.
                  </p>
                )}
                <p className="text-xs text-gray-400 text-center mt-1">
                  Bằng việc nhấn "Đặt sân ngay", bạn đồng ý với các điều khoản dịch vụ.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}