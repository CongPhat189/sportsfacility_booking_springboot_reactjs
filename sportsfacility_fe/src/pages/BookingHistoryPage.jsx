import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { authAPIs, endpoints } from '../config/APIs'
import { MapPin, Clock, Calendar } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const STATUS_LABELS = {
  PENDING:    'Chờ thanh toán',
  CONFIRMED:  'Đã xác nhận',
  CANCELLED:  'Đã hủy',
  CHECKED_IN: 'Đã check-in',
  EXPIRED:    'Hết hạn',
  COMPLETED:  'Hoàn thành',
}

const TABS = [
  { key: 'PENDING',   label: 'Chờ thanh toán' },
  { key: 'CONFIRMED', label: 'Đã xác nhận' },
  { key: 'COMPLETED', label: 'Hoàn thành' },
  { key: 'CANCELLED', label: 'Đã hủy' },
]

export default function BookingHistoryPage() {
  const [bookings, setBookings] = useState([])
  const [activeTab, setActiveTab] = useState('PENDING')
  const [cancelModal, setCancelModal] = useState(null)
  const [cancelForm, setCancelForm] = useState({
    cancelReason: '', bankName: '', accountNumber: '', accountHolder: ''
  })
  const [reviewModal, setReviewModal] = useState(null)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [reviews, setReviews] = useState({})

  const loadHistory = async () => {
    try {
      const res = await authAPIs().get(endpoints['booking-history'])
      setBookings(res.data)
      const completed = res.data.filter(b => b.status === 'COMPLETED')
      const reviewMap = {}
      await Promise.all(completed.map(async b => {
        try {
          const r = await authAPIs().get(endpoints['booking-review'](b.id))
          if (r.status === 200) reviewMap[b.id] = r.data
        } catch { /* ignore */ }
      }))
      setReviews(reviewMap)
    } catch {
      toast.error('Không thể tải lịch sử đặt sân')
    }
  }

  useEffect(() => {
    const init = async () => { await loadHistory() }
    init()
  }, [])


  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'CANCELLED') return b.status === 'CANCELLED' || b.status === 'EXPIRED'
    return b.status === activeTab
  })

  const willRefund = (b) => {
    const createdAt = new Date(b.createdAt)
    return new Date() - createdAt <= 24 * 60 * 60 * 1000
  }


  const handleCancel = async () => {
    try {
      const res = await authAPIs().post(endpoints['cancel-booking'](cancelModal), cancelForm)
      toast.success(res.data.message)
      setCancelModal(null)
      setCancelForm({ cancelReason: '', bankName: '', accountNumber: '', accountHolder: '' })
      loadHistory()
    } catch (err) {
      toast.error(err.response?.data || 'Hủy thất bại')
    }
  }

  const handleSubmitReview = async () => {
    try {
      const res = await authAPIs().post(endpoints['create-review'], {
        bookingId: reviewModal,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      })
      setReviews(prev => ({ ...prev, [reviewModal]: res.data }))
      toast.success('Đánh giá thành công!')
      setReviewModal(null)
    } catch (err) {
      toast.error(err.response?.data || 'Gửi đánh giá thất bại')
    }
  }

  const handleRepayment = async (bookingId) => {
    try {
      const payRes = await authAPIs().post(endpoints['vnpay-create'], { bookingId })
      window.location.assign(payRes.data.paymentUrl)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể tạo link thanh toán')
    }
  }


  const selectedBooking = bookings.find(b => b.id === cancelModal)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Page header */}
      <div className="max-w-5xl mx-auto w-full px-8 pt-10 pb-4">
        <h1 className="text-3xl font-black text-gray-900">Lịch sử đặt sân của tôi</h1>
        <p className="text-gray-500 mt-1">Quản lý các lượt đặt sân sắp tới, xem lại lịch sử các trận đấu đã hoàn thành hoặc các yêu cầu đã hủy của bạn.</p>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto w-full px-8 border-b border-gray-200 mb-8">
        <div className="flex gap-8">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`pb-3 text-sm font-semibold border-b-2 transition ${
                activeTab === t.key
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto w-full px-8 flex-1 pb-12">
        {filteredBookings.length === 0 ? (
          <p className="text-center text-gray-400 py-20">Không có đơn đặt sân nào</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredBookings.map(b => (
              <div key={b.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex">
                {/* Ảnh + badge */}
                <div className="relative w-44 flex-shrink-0">
                  <img
                    src={b.courtImageUrl || 'https://placehold.co/200x200?text=No+Image'}
                    alt={b.courtName}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {STATUS_LABELS[b.status]}
                  </span>
                </div>

                {/* Thông tin */}
                <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-base leading-tight">{b.courtName}</h3>
                      <span className="text-green-600 font-bold text-base flex-shrink-0">
                        {b.totalAmount?.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-1">
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                      {new Date(b.bookingDateTime).toLocaleDateString('vi-VN')}
                    </p>
                    {b.scheduleStartTime && b.scheduleEndTime && (
                      <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-1">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                        {b.scheduleStartTime} - {b.scheduleEndTime}
                      </p>
                    )}
                    {b.courtAddress && (
                      <p className="text-sm text-gray-500 flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        {b.courtAddress}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex gap-2">
                    {b.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleRepayment(b.id)}
                          className="flex-1 bg-orange-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-orange-600">
                          Thanh toán ngay
                        </button>
                        <button onClick={() => setCancelModal(b.id)}
                          className="px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
                          Hủy
                        </button>
                      </>
                    )}
                    {b.status === 'CONFIRMED' && (
                      <button onClick={() => setCancelModal(b.id)}
                        className="px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
                        Hủy đặt sân
                      </button>
                    )}
                    {b.status === 'COMPLETED' && (
                      reviews[b.id] ? (
                        <div className="text-yellow-400 text-sm">
                          {'★'.repeat(reviews[b.id].rating)}
                          <span className="text-gray-500 ml-2">{reviews[b.id].comment}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setReviewModal(b.id); setReviewForm({ rating: 5, comment: '' }) }}
                          className="text-sm text-purple-600 font-semibold hover:underline">
                          ★ Đánh giá
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* Cancel Modal */}
      {cancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Hủy đặt sân</h2>
            {selectedBooking.status === 'PENDING' ? (
              <div className="bg-blue-50 text-blue-700 text-sm px-3 py-2 rounded-lg mb-3">
                Bạn chưa thanh toán — hủy đơn này sẽ không mất phí.
              </div>
            ) : willRefund(selectedBooking) ? (
              <div className="bg-green-50 text-green-700 text-sm px-3 py-2 rounded-lg mb-3">
                Hủy trong 24 giờ kể từ lúc đặt — tiền cọc sẽ được hoàn trả đầy đủ
              </div>
            ) : (
              <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-3">
              Quá 24 giờ kể từ lúc đặt — tiền cọc sẽ không được hoàn
            </div>
            )}


            <textarea placeholder="Lý do hủy..." className="w-full border rounded-lg p-2 mb-3 text-sm" rows={3}
              value={cancelForm.cancelReason}
              onChange={e => setCancelForm({ ...cancelForm, cancelReason: e.target.value })} />
            {selectedBooking.status !== 'PENDING'  && willRefund(selectedBooking) && (
              <>
                <input placeholder="Tên ngân hàng" className="w-full border rounded-lg px-3 py-2 mb-2 text-sm"
                  value={cancelForm.bankName} onChange={e => setCancelForm({ ...cancelForm, bankName: e.target.value })} />
                <input placeholder="Số tài khoản" className="w-full border rounded-lg px-3 py-2 mb-2 text-sm"
                  value={cancelForm.accountNumber} onChange={e => setCancelForm({ ...cancelForm, accountNumber: e.target.value })} />
                <input placeholder="Chủ tài khoản" className="w-full border rounded-lg px-3 py-2 mb-3 text-sm"
                  value={cancelForm.accountHolder} onChange={e => setCancelForm({ ...cancelForm, accountHolder: e.target.value })} />
              </>
            )}
            <div className="flex gap-3 mt-2">
              <button onClick={() => setCancelModal(null)} className="flex-1 border rounded-lg py-2 text-sm hover:bg-gray-50">Đóng</button>
              <button onClick={handleCancel} className="flex-1 bg-red-500 text-white rounded-lg py-2 text-sm hover:bg-red-600">Xác nhận hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Đánh giá sân</h2>
            <div className="flex gap-2 mb-4 justify-center">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  className={`text-3xl transition-transform hover:scale-110 ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                  ★
                </button>
              ))}
            </div>
            <textarea placeholder="Nhận xét của bạn về sân..." className="w-full border rounded-lg p-3 text-sm mb-4" rows={4}
              value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} />
            <div className="flex gap-3">
              <button onClick={() => setReviewModal(null)} className="flex-1 border rounded-lg py-2 text-sm hover:bg-gray-50">Đóng</button>
              <button onClick={handleSubmitReview} className="flex-1 bg-purple-600 text-white rounded-lg py-2 text-sm hover:bg-purple-700">Gửi đánh giá</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
