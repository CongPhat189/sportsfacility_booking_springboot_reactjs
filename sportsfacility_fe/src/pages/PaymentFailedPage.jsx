import { Link } from 'react-router-dom'

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-10 rounded-xl shadow text-center max-w-sm w-full">
        <div className="text-red-500 text-6xl mb-4">✗</div>
        <h1 className="text-2xl font-bold mb-2">Thanh toán thất bại!</h1>
        <p className="text-gray-500 mb-6">Có lỗi xảy ra trong quá trình thanh toán.</p>
        <Link to="/courts"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-block">
          Quay lại tìm sân
        </Link>
      </div>
    </div>
  )
}
