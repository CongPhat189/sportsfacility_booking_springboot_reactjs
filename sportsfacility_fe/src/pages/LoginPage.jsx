import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios, { endpoints } from '../config/APIs'
import { useAuth } from '../context/AuthProvider'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', role: 'CUSTOMER' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(endpoints['login'], {
        ...form,
      })

      login({
        id: res.data.id,
        fullName: res.data.fullName,
        role: res.data.role,
        phone: res.data.phone,
        avatarUrl: res.data.avatarUrl
      }, res.data.token);

      const role = res.data.role;

      if (role === "CUSTOMER") {
        navigate("/");
      } else if (role === "OWNER") {
        navigate("/owner");
      } else if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data || 'Đăng nhập thất bại')
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
          Đặt sân thể thao dễ dàng, nhanh chóng. Tìm và đặt sân yêu thích chỉ trong vài bước.
        </p>
      </div>
    </div>

    {/* Cột phải - Form */}
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-900">Chào mừng trở lại 👋</h2>
          <p className="text-gray-500 mt-2">Đăng nhập để tiếp tục đặt sân</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} placeholder="••••••••" required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
              <button type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Đăng nhập với tư cách</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
            >
              <option value="CUSTOMER">Khách hàng</option>
              <option value="OWNER">Chủ sân</option>
              <option value="ADMIN">Quản trị viên</option>
            </select>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold text-base transition disabled:opacity-50 mt-2"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-green-600 font-semibold hover:underline">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  </div>
)

}
