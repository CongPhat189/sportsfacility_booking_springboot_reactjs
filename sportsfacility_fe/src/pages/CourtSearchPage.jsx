import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Search, ChevronRight, ChevronLeft, Navigation, MapPin, Map } from 'lucide-react'
import axios, { endpoints } from '../config/APIs'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'


const PAGE_SIZE = 6

export default function CourtSearchPage() {
  const [keyword, setKeyword] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState([])
  const [courts, setCourts] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [city, setCity] = useState('')
  const [sortBy, setSortBy] = useState('')

  const totalPages = Math.ceil(courts.length / PAGE_SIZE)
  const paginatedCourts = courts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleSearch = async (e, overrideCategoryId) => {
    e?.preventDefault()
    setLoading(true)
    setCurrentPage(1)
    try {
      const combinedKeyword = [keyword, city].filter(Boolean).join(' ') || undefined
      const res = await axios.get(endpoints['courts-search'], {
        params: {
          keyword: combinedKeyword,
          categoryId: (overrideCategoryId !== undefined ? overrideCategoryId : categoryId) || undefined,
          sortBy: sortBy || undefined
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
    const kw = searchParams.get('keyword') || ''
    const cat = searchParams.get('categoryId') || ''
    const city = searchParams.get('city') || ''
    setCity(city)
    setKeyword(kw)
    setCategoryId(cat)
    axios.get(endpoints['categories']).then(res => setCategories(res.data)).catch(() => {})
    setLoading(true)
    const combined = [kw, city].filter(Boolean).join(' ') || undefined
  axios.get(endpoints['courts-search'], {
    params: { keyword: combined, categoryId: cat || undefined }
  }).then(res => setCourts(res.data)).catch(() => setCourts([])).finally(() => setLoading(false))
  }, [searchParams])

  useEffect(() => {
    const timer = setTimeout(() => {
      const cat = searchParams.get('categoryId') || ''
      handleSearch(null, cat)
    }, 500)
    return () => clearTimeout(timer)
  }, [keyword])

  useEffect(() => {
    handleSearch()
  }, [sortBy])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar /> 
      {/* Search section */}
      <section className="bg-white border-b py-6 px-8">
        <div className="max-w-4xl mx-auto flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Bạn muốn chơi gì?"
              className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
          </div>
          <div className="relative">
            <select value={city} onChange={e => setCity(e.target.value)}
              className="appearance-none border border-gray-200 rounded-xl pl-4 pr-9 py-3.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white cursor-pointer">
              <option value="">Tất cả thành phố</option>
              <option value="TP.HCM">TP. Hồ Chí Minh</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Cần Thơ">Cần Thơ</option>
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
          </div>
          <button
            onClick={handleSearch}
            className="bg-green-600 text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-green-700 flex-shrink-0"
          >
            Tìm kiếm ngay
          </button>
        </div>
      </section>

      {/* Results */}
      <section className="flex-1 py-8 px-8">
        <div className="max-w-6xl mx-auto">

          {/* Header row */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-black text-gray-900">Kết quả tìm kiếm</h2>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <button
              onClick={() => { setCategoryId(''); handleSearch(null, '') }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition ${
                categoryId === '' ? 'bg-green-600 text-white border-green-600' : 'border-gray-300 text-gray-700 hover:border-green-400'
              }`}
            >
              Tất cả
            </button>
            <span className="text-sm text-gray-500 font-medium">Sắp xếp:</span>
            <button
              onClick={() => { setSortBy('')}}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                sortBy === '' ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              Mặc định
            </button>
            <button
              onClick={() => { setSortBy('rating')}}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                sortBy === 'rating' ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-300 text-gray-700 hover:border-orange-400'
              }`}
            >
              🔥 Sân hot
            </button>
            <span className="w-px h-5 bg-gray-300 mx-1"></span>
            {categories.map(c => (
              <button key={c.id}
                onClick={() => { setCategoryId(String(c.id)); handleSearch(null, c.id) }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition ${
                  categoryId === String(c.id) ? 'bg-green-600 text-white border-green-600' : 'border-gray-300 text-gray-700 hover:border-green-400'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Cards */}
          {loading ? (
            <p className="text-center text-gray-400 py-20">Đang tải...</p>
          ) : courts.length === 0 ? (
            <p className="text-center text-gray-400 py-20">Không tìm thấy sân nào</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {paginatedCourts.map(court => (
                  <div
                    key={court.id}
                    onClick={() => navigate(`/courts/${court.id}`)}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={court.imageUrl || 'https://placehold.co/400x200?text=No+Image'}
                        alt={court.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {court.categoryName}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 text-lg mb-1">{court.name}</h3>
                      <div className="mb-4">
                          <p className="text-gray-500 text-sm flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{court.address}</span>
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(court.address)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="ml-1 text-green-600 hover:text-green-800 flex-shrink-0"
                              title="Xem trên Google Maps"
                            >
                              <Map className="w-3.5 h-3.5" />
                            </a>
                          </p>
                          {court.averageRating && (
                            <p className="text-yellow-500 text-sm font-semibold mt-1">
                              ⭐ {court.averageRating} <span className="text-gray-400 font-normal">({court.reviewCount} đánh giá)</span>
                            </p>
                          )}
                        </div>
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/courts/${court.id}`) }}
                        className="w-full bg-green-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-green-600 flex items-center justify-center gap-1"
                      >
                        Đặt sân ngay <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

             

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-green-500 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-9 h-9 rounded-full text-sm font-semibold transition ${
                        currentPage === p
                          ? 'bg-green-600 text-white'
                          : 'border border-gray-300 text-gray-600 hover:border-green-500'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  {totalPages > 5 && <span className="text-gray-400">...</span>}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-green-500 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}
