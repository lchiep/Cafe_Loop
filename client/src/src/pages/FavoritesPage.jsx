import { Link } from 'react-router-dom'

export default function FavoritesPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8 fade-in">
      <h1 className="text-[20px] font-bold text-slate-900 mb-1">Yêu thích</h1>
      <p className="text-[12px] text-slate-400 mb-8">Quán cafe bạn đã lưu</p>
      <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-card">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center mx-auto mb-4 text-[28px]">♡</div>
        <p className="text-[15px] font-bold text-slate-700 mb-1">Chưa có quán yêu thích</p>
        <p className="text-[12px] text-slate-400 mb-6">Nhấn ❤️ trên thẻ quán để lưu lại</p>
        <Link to="/results" className="inline-block bg-blue-500 text-white px-6 py-2.5 rounded-xl text-[13px] font-semibold shadow-blue hover:bg-blue-600 transition-all">
          Khám phá ngay
        </Link>
      </div>
    </div>
  )
}
