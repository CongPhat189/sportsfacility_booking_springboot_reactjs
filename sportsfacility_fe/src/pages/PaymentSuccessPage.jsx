import { Link } from 'react-router-dom'

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-10 rounded-xl shadow text-center max-w-sm w-full">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold mb-2">Thanh toán thành công!</h1>
        <p className="text-gray-500 mb-6">Đặt sân của bạn đã được xác nhận.</p>
        <Link to="/my-bookings"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-block">
          Xem lịch đặt sân
        </Link>
      </div>
    </div>
  )
}
