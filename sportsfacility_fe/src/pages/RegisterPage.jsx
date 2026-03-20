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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Đăng ký</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text" placeholder="Họ và tên" required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.fullName}
            onChange={e => setForm({ ...form, fullName: e.target.value })}
          />
          <input
            type="email" placeholder="Email" required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'} placeholder="Mật khẩu" required
              className="w-full border rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
            <button type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'} placeholder="Nhập lại mật khẩu" required
              className={`w-full border rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 ${
                form.confirmPassword && form.password !== form.confirmPassword
                  ? 'border-red-400 focus:ring-red-400'
                  : 'focus:ring-blue-500'
              }`}
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
            />
            <button type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? '🙈' : '👁️'}
            </button>
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">Mật khẩu không khớp</p>
            )}
          </div>
          <input
            type="tel" placeholder="Số điện thoại"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  )
}
