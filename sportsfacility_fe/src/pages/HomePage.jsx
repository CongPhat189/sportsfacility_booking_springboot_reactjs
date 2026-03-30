import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios, { endpoints } from '../config/APIs'
import { Search, CircleDot, Feather, Disc3, Target, LayoutGrid, MapPin } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'


export default function HomePage() {
  const [keyword, setKeyword] = useState('')
  const [categories, setCategories] = useState([])
  const [featuredCourts, setFeaturedCourts] = useState([])
  const [city, setCity] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(endpoints['categories']).then(res => setCategories(res.data)).catch(() => {})
    axios.get(endpoints['courts-search']).then(res => setFeaturedCourts(res.data.slice(0, 3))).catch(() => {})
  }, [])

  const categoryIconMap = {
    'Bóng đá': <CircleDot className="w-10 h-10" />,
    'Cầu lông': <Feather className="w-10 h-10" />,
    'Tennis': <Disc3 className="w-10 h-10" />,
    'Bóng rổ': <Target className="w-10 h-10" />,
  }

  const handleSearch = (e) => {
    e?.preventDefault()
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    if (city) params.set('city', city)
    navigate(`/courts?${params.toString()}`)
  }

return (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <section
      className="relative text-white py-32 px-8"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-black uppercase leading-tight mb-4">
          Đặt sân thể thao<br/>
          <span className="text-green-400">Dễ dàng & Nhanh chóng</span>
        </h1>
        <p className="text-gray-300 text-lg mb-8">
          Tìm và đặt sân thể thao yêu thích chỉ trong vài giây
        </p>
        <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto bg-white rounded-full p-2 shadow-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Bạn muốn chơi gì?"
              className="w-full pl-10 pr-4 py-2.5 rounded-full text-gray-800 bg-transparent focus:outline-none text-sm"
              value={keyword} onChange={e => setKeyword(e.target.value)} />
          </div>
          <div className="w-px bg-gray-200 my-1" />
          <select value={city} onChange={e => setCity(e.target.value)}
            className="px-4 py-2.5 text-sm text-gray-700 bg-transparent focus:outline-none cursor-pointer">
            <option value="">Tất cả thành phố</option>
            <option value="TP.HCM">TP. Hồ Chí Minh</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
            <option value="Cần Thơ">Cần Thơ</option>
          </select>
          <button type="submit" className="bg-green-500 text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-green-600 flex-shrink-0">
            Tìm kiếm
          </button>
        </form>
      </div>
    </section>
    <section className="bg-gray-50 py-12 px-8">
      <div className="max-w-5xl mx-auto">
        <p className="text-green-600 text-sm font-bold uppercase tracking-widest mb-1">Danh mục</p>
        <h2 className="text-2xl font-black text-gray-900 mb-8">Chọn môn thể thao</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map(c => (
            <button key={c.id} onClick={() => navigate(`/courts?categoryId=${c.id}`)}
              className="bg-white rounded-xl p-6 flex flex-col items-center gap-3 hover:bg-green-600 hover:shadow-md transition-all group">
              <div className="text-green-600 group-hover:text-white group-hover:scale-110 transition-all">
                {categoryIconMap[c.name] || <CircleDot className="w-10 h-10" />}
              </div>
              <span className="font-semibold text-gray-700 text-sm group-hover:text-white">{c.name}</span>
            </button>
          ))}
          <button onClick={() => navigate('/courts')}
            className="bg-white rounded-xl p-6 flex flex-col items-center gap-3 hover:bg-green-600 hover:shadow-md transition-all group">
            <div className="text-green-600 group-hover:text-white group-hover:scale-110 transition-all">
              <LayoutGrid className="w-10 h-10" />
            </div>
            <span className="font-semibold text-gray-700 text-sm group-hover:text-white">Tất cả</span>
          </button>
        </div>
      </div>
    </section>
    <section className="bg-white py-12 px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-green-600 text-sm font-bold uppercase tracking-widest mb-1">Dành cho bạn</p>
            <h2 className="text-2xl font-black text-gray-900">Sân thể thao nổi bật</h2>
          </div>
          <button onClick={() => navigate('/courts')}
            className="text-green-600 font-semibold text-sm hover:underline flex items-center gap-1">
            Xem tất cả →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCourts.map(court => (
            <div key={court.id} onClick={() => navigate(`/courts/${court.id}`)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
              <div className="relative">
                <img src={court.imageUrl || 'https://placehold.co/400x240?text=No+Image'}
                  alt={court.name} className="w-full h-48 object-cover" />
                <span className="absolute top-3 left-3 bg-white text-gray-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  {court.categoryName}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-base mb-1">{court.name}</h3>
                <p className="text-gray-500 text-sm flex items-center gap-1 mb-4 truncate">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />{court.address}
                </p>
                <button onClick={e => { e.stopPropagation(); navigate(`/courts/${court.id}`) }}
                  className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-600 hover:text-white transition-colors">
                  Đặt sân ngay
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>


    <Footer />
  </div>
)
}
