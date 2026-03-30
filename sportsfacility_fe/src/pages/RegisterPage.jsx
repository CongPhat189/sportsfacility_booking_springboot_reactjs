import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios, { endpoints } from '../config/APIs'

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', phone: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Mật khẩu nhập lại không khớp')
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('fullName', form.fullName)
      formData.append('email', form.email)
      formData.append('password', form.password)
      formData.append('phone', form.phone)
      formData.append('role', 'CUSTOMER')

      await axios.post(endpoints['register'], formData)
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data || 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
  <div className="min-h-screen flex">
    {/* Cột trái - Banner */}
    <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-green-600 to-green-900 flex-col items-center justify-center p-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-8 border-white"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full border-8 border-white"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full border-8 border-white"></div>
      </div>
      <div className="relative z-10 text-center text-white">
        <div className="text-6xl mb-6">🏟️</div>
        <h1 className="text-4xl font-black mb-4">SportBooking</h1>
        <p className="text-green-100 text-lg leading-relaxed max-w-sm">
          Tham gia cộng đồng thể thao. Đặt sân, kết nối bạn bè và tận hưởng trận đấu.
        </p>
        <div className="mt-10 space-y-3 text-left">
          {['Đặt sân nhanh chóng, dễ dàng', 'Thanh toán an toàn qua VNPay', 'Quản lý lịch đặt mọi lúc mọi nơi'].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-green-100">
              <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Cột phải - Form */}
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-900">Tạo tài khoản 🚀</h2>
          <p className="text-gray-500 mt-2">Đăng ký miễn phí và bắt đầu đặt sân ngay</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Họ và tên</label>
            <input
              type="text" placeholder="Nhập họ và tên" required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Email</label>
            <input
              type="email" placeholder="Email" required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Số điện thoại</label>
            <input
              type="tel" placeholder="Số điện thoại"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} placeholder="••••••••" required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >{showPassword ? '🙈' : '👁️'}</button>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Nhập lại</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'} placeholder="••••••••" required
                  className={`w-full border rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 bg-gray-50 ${
                    form.confirmPassword && form.password !== form.confirmPassword
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-gray-200 focus:ring-green-400'
                  }`}
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                />
                <button type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowConfirm(!showConfirm)}
                >{showConfirm ? '🙈' : '👁️'}</button>
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">Không khớp</p>
              )}
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold text-base transition disabled:opacity-50"
          >
            {loading ? 'Đang đăng ký...' : 'Tạo tài khoản'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-green-600 font-semibold hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  </div>
)

}
