import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import axios, { endpoints } from '../config/APIs'

export default function CourtSearchPage() {
  const [keyword, setKeyword] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState([])
  const [courts, setCourts] = useState([])
  const [loading, setLoading] = useState(false)
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
    </div>
  )
}
