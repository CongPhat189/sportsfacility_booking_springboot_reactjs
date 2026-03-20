import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authAPIs, endpoints } from '../config/APIs'

const STATUS_LABELS = {
  PENDING:    { label: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-700' },
  CONFIRMED:  { label: 'Đã xác nhận',   color: 'bg-green-100 text-green-700' },
  CANCELLED:  { label: 'Đã hủy',        color: 'bg-red-100 text-red-700' },
  CHECKED_IN: { label: 'Đã check-in',   color: 'bg-blue-100 text-blue-700' },
  EXPIRED:    { label: 'Hết hạn',       color: 'bg-gray-100 text-gray-500' },
}

export default function BookingHistoryPage() {
  const [bookings, setBookings] = useState([])
  const [cancelModal, setCancelModal] = useState(null)
  const [cancelForm, setCancelForm] = useState({
    cancelReason: '', bankName: '', accountNumber: '', accountHolder: ''
  })
  const navigate = useNavigate()

  const loadHistory = async () => {
    try {
      const res = await authAPIs().get(endpoints['booking-history'])
      setBookings(res.data)
    } catch {
      toast.error('Không thể tải lịch sử đặt sân')
    }
  }

  useEffect(() => {
    authAPIs().get(endpoints['booking-history'])
      .then(res => setBookings(res.data))
      .catch(() => toast.error('Không thể tải lịch sử đặt sân'))
  }, [])

  const canCancel = (b) => b.status === 'PENDING' || b.status === 'CONFIRMED'

  const willRefund = (b) => {
    const bookingTime = new Date(b.bookingDateTime)
    return bookingTime - new Date() > 24 * 60 * 60 * 1000
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

  const selectedBooking = bookings.find(b => b.id === cancelModal)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate('/courts')}>
          SportBook
        </h1>
        <button onClick={() => navigate('/courts')} className="text-sm text-gray-500 hover:underline">
          ← Quay lại tìm sân
        </button>
      </div>

      <div className="max-w-3xl mx-auto mt-8 px-4 pb-10">
        <h2 className="text-2xl font-bold mb-6">Lịch sử đặt sân</h2>

        {bookings.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Bạn chưa có đơn đặt sân nào</p>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => {
              const st = STATUS_LABELS[b.status] || { label: b.status, color: 'bg-gray-100' }
              return (
                <div key={b.id} className="bg-white rounded-xl shadow-sm p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{b.courtName}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(b.bookingDateTime).toLocaleString('vi-VN')}
                      </p>
                      <p className="text-sm mt-1">
                        Tiền cọc: <span className="font-medium text-blue-600">
                          {b.depositAmount?.toLocaleString('vi-VN')}đ
                        </span>
                      </p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${st.color}`}>
                      {st.label}
                    </span>
                  </div>
                  {canCancel(b) && (
                    <button
                      onClick={() => setCancelModal(b.id)}
                      className="mt-3 text-sm text-red-500 hover:underline"
                    >
                      Hủy đặt sân
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {cancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Hủy đặt sân</h2>

            {willRefund(selectedBooking) ? (
              <div className="bg-green-50 text-green-700 text-sm px-3 py-2 rounded-lg mb-3">
                Hủy trước 24 giờ — tiền cọc sẽ được hoàn trả
              </div>
            ) : (
              <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-3">
                Hủy trong vòng 24 giờ — tiền cọc sẽ không được hoàn
              </div>
            )}

            <textarea
              placeholder="Lý do hủy..."
              className="w-full border rounded-lg p-2 mb-3 text-sm"
              rows={3}
              value={cancelForm.cancelReason}
              onChange={e => setCancelForm({ ...cancelForm, cancelReason: e.target.value })}
            />

            {willRefund(selectedBooking) && (
              <>
                <input
                  placeholder="Tên ngân hàng"
                  className="w-full border rounded-lg px-3 py-2 mb-2 text-sm"
                  value={cancelForm.bankName}
                  onChange={e => setCancelForm({ ...cancelForm, bankName: e.target.value })}
                />
                <input
                  placeholder="Số tài khoản"
                  className="w-full border rounded-lg px-3 py-2 mb-2 text-sm"
                  value={cancelForm.accountNumber}
                  onChange={e => setCancelForm({ ...cancelForm, accountNumber: e.target.value })}
                />
                <input
                  placeholder="Chủ tài khoản"
                  className="w-full border rounded-lg px-3 py-2 mb-3 text-sm"
                  value={cancelForm.accountHolder}
                  onChange={e => setCancelForm({ ...cancelForm, accountHolder: e.target.value })}
                />
              </>
            )}

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setCancelModal(null)}
                className="flex-1 border rounded-lg py-2 text-sm hover:bg-gray-50"
              >
                Đóng
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-red-500 text-white rounded-lg py-2 text-sm hover:bg-red-600"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
