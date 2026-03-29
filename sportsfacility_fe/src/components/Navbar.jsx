import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const links = [
    { label: 'Khám phá', path: '/' },
    { label: 'Danh mục sân', path: '/courts' },
    { label: 'Lịch đặt của tôi', path: '/my-bookings' },
  ]

  return (
    <nav className="bg-white shadow-sm px-8 py-4 flex items-center justify-between sticky top-0 z-40">
      <span onClick={() => navigate('/')} className="text-xl font-black cursor-pointer">
        SPORTS<span className="text-green-600">BOOK</span>
      </span>

      <div className="flex items-center gap-8">
        {links.map(link => (
          <button key={link.path} onClick={() => navigate(link.path)}
            className={`text-sm font-medium transition ${
              location.pathname === link.path
                ? 'text-green-600 border-b-2 border-green-600 pb-0.5'
                : 'text-gray-600 hover:text-green-600'
            }`}>
            {link.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="relative group">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Xin chào, <strong>{user.name}</strong></span>
              <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="absolute right-0 top-10 bg-white shadow-lg rounded-xl py-2 w-44 hidden group-hover:block z-50">
              <button onClick={() => navigate('/my-bookings')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">Lịch đặt sân</button>
              <button onClick={() => navigate('/profile')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">Hồ sơ</button>
              <button onClick={logout} className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-50">Đăng xuất</button>
            </div>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700">
            Đăng nhập
          </button>
        )}
      </div>
    </nav>
  )
}
