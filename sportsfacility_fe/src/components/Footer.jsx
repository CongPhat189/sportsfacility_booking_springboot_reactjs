export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div>
          <p className="font-black text-white text-xl">SPORTSBOOK</p>
          <p className="text-sm mt-1">© 2025 SPORTSBOOK. Nền tảng đặt sân thể thao trực tuyến.</p>
        </div>
        <div className="flex gap-6 text-sm">
          <button className="hover:text-white">Về chúng tôi</button>
          <button className="hover:text-white">Điều khoản</button>
          <button className="hover:text-white">Bảo mật</button>
          <button className="hover:text-white">Liên hệ</button>
        </div>
      </div>
    </footer>
  )
}
