import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/* ── Toggle switch ── */
function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      className="relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0"
      style={{ background: checked ? 'linear-gradient(135deg,#06b6d4,#3b82f6)' : 'rgba(255,255,255,0.1)' }}>
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${checked ? 'left-6' : 'left-0.5'}`}/>
    </button>
  )
}

/* ── Section card ── */
function Section({ title, icon, children }) {
  return (
    <div className="rounded-2xl overflow-hidden mb-4"
      style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
      }}>
      <div className="px-5 py-3.5 border-b border-white/8 flex items-center gap-2.5">
        <span className="text-base">{icon}</span>
        <p className="text-[12px] font-black text-white/40 uppercase tracking-widest">{title}</p>
      </div>
      <div>{children}</div>
    </div>
  )
}

/* ── Setting row ── */
function Row({ label, sub, right, onClick, danger = false, border = true }) {
  return (
    <div onClick={onClick}
      className={`flex items-center gap-4 px-5 py-4 ${onClick ? 'cursor-pointer hover:bg-white/5' : ''} transition-colors ${border ? 'border-b border-white/5' : ''}`}>
      <div className="flex-1 min-w-0">
        <p className={`text-[14px] font-semibold leading-tight ${danger ? 'text-rose-400' : 'text-white/90'}`}>{label}</p>
        {sub && <p className="text-[11px] text-white/35 mt-0.5">{sub}</p>}
      </div>
      {right && <div className="flex-shrink-0">{right}</div>}
    </div>
  )
}

const THEMES = [
  { id:'dark', label:'Tối', grad:'from-slate-800 to-slate-900' },
  { id:'blue', label:'Blue', grad:'from-blue-900 to-slate-900' },
  { id:'auto', label:'Tự động', grad:'from-slate-600 to-blue-900' },
]

const LANGS = ['Tiếng Việt','English']
const DISTS = ['1 km','3 km','5 km','10 km']

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [notifNew,    setNotifNew]    = useState(true)
  const [notifReview, setNotifReview] = useState(false)
  const [notifPromo,  setNotifPromo]  = useState(true)
  const [theme,       setTheme]       = useState('dark')
  const [lang,        setLang]        = useState('Tiếng Việt')
  const [dist,        setDist]        = useState('5 km')
  const [saveHistory, setSaveHistory] = useState(true)
  const [shareData,   setShareData]   = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen fade-in"
      style={{
        background: 'radial-gradient(ellipse at 60% 10%, rgba(139,92,246,0.12) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(59,130,246,0.10) 0%, transparent 50%), linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#0f2744 100%)',
      }}>
      <div className="max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/profile" className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-white">Cài đặt</h1>
            <p className="text-sm text-white/40 mt-0.5">Tuỳ chỉnh trải nghiệm của bạn</p>
          </div>
        </div>

        {/* ── Tài khoản ── */}
        {user && (
          <Section title="Tài khoản" icon="👤">
            <Row label={user.name} sub={user.email} border/>
            <Row label="Đổi mật khẩu" sub="Cập nhật mật khẩu mới"
              right={<svg className="w-4 h-4 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>}
              onClick={() => {}} border/>
            <Row label="Ảnh đại diện" sub="Thay ảnh profile"
              right={<svg className="w-4 h-4 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>}
              onClick={() => {}} border={false}/>
          </Section>
        )}

        {/* ── Giao diện ── */}
        <Section title="Giao diện" icon="🎨">
          <div className="px-5 py-4 border-b border-white/5">
            <p className="text-[14px] font-semibold text-white/90 mb-3">Chủ đề màu sắc</p>
            <div className="flex gap-2">
              {THEMES.map(t => (
                <button key={t.id} onClick={() => setTheme(t.id)}
                  className={`flex-1 py-2.5 rounded-xl text-[12px] font-bold transition-all duration-200 bg-gradient-to-br ${t.grad} ${theme === t.id ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-transparent scale-105' : 'opacity-60 hover:opacity-80'}`}>
                  <span className="text-white">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="px-5 py-4 border-b border-white/5">
            <p className="text-[14px] font-semibold text-white/90 mb-3">Ngôn ngữ</p>
            <div className="flex gap-2">
              {LANGS.map(l => (
                <button key={l} onClick={() => setLang(l)}
                  className={`flex-1 py-2.5 rounded-xl text-[12px] font-bold transition-all duration-200 ${lang === l ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                  style={lang === l ? { background:'rgba(6,182,212,0.2)', border:'1px solid rgba(6,182,212,0.4)' } : { background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Thông báo ── */}
        <Section title="Thông báo" icon="🔔">
          <Row label="Quán mới gần bạn" sub="Nhận thông báo khi có quán mới" right={<Toggle checked={notifNew} onChange={setNotifNew}/>} border/>
          <Row label="Đánh giá mới" sub="Khi có người đánh giá quán bạn theo dõi" right={<Toggle checked={notifReview} onChange={setNotifReview}/>} border/>
          <Row label="Khuyến mãi" sub="Ưu đãi và sự kiện đặc biệt" right={<Toggle checked={notifPromo} onChange={setNotifPromo}/>} border={false}/>
        </Section>

        {/* ── Khám phá ── */}
        <Section title="Khám phá" icon="📍">
          <div className="px-5 py-4 border-b border-white/5">
            <p className="text-[14px] font-semibold text-white/90 mb-3">Bán kính tìm kiếm</p>
            <div className="flex gap-2 flex-wrap">
              {DISTS.map(d => (
                <button key={d} onClick={() => setDist(d)}
                  className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all ${dist === d ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                  style={dist === d ? { background:'rgba(6,182,212,0.2)', border:'1px solid rgba(6,182,212,0.4)' } : { background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <Row label="Lưu lịch sử xem" sub="Ghi nhớ các quán đã xem" right={<Toggle checked={saveHistory} onChange={setSaveHistory}/>} border={false}/>
        </Section>

        {/* ── Quyền riêng tư ── */}
        <Section title="Quyền riêng tư" icon="🔒">
          <Row label="Chia sẻ dữ liệu ẩn danh" sub="Giúp cải thiện ứng dụng" right={<Toggle checked={shareData} onChange={setShareData}/>} border/>
          <Row label="Xoá lịch sử xem" sub="Xoá tất cả quán đã xem"
            onClick={() => { localStorage.removeItem('cafeloop_history'); alert('Đã xoá lịch sử!') }}
            right={<span className="text-[12px] text-rose-400 font-semibold">Xoá</span>}
            border={false}/>
        </Section>

        {/* ── Về ứng dụng ── */}
        <Section title="Về ứng dụng" icon="ℹ️">
          <Row label="Phiên bản" right={<span className="text-[12px] text-white/30 font-mono">v1.0.0</span>} border/>
          <Row label="Điều khoản sử dụng" onClick={() => {}}
            right={<svg className="w-4 h-4 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>}
            border/>
          <Row label="Chính sách quyền riêng tư" onClick={() => {}}
            right={<svg className="w-4 h-4 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>}
            border={false}/>
        </Section>

        {/* ── Logout ── */}
        {user ? (
          <button onClick={handleLogout}
            className="w-full py-4 rounded-2xl text-sm font-bold text-rose-400 transition-all duration-200 hover:bg-rose-500/10 mb-8"
            style={{ background:'rgba(244,63,94,0.06)', border:'1px solid rgba(244,63,94,0.2)' }}>
            Đăng xuất
          </button>
        ) : (
          <Link to="/login"
            className="w-full py-4 rounded-2xl text-sm font-bold text-white flex items-center justify-center mb-8 transition-all hover:brightness-110"
            style={{ background:'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow:'0 4px 20px rgba(6,182,212,0.4)' }}>
            Đăng nhập
          </Link>
        )}
      </div>
    </div>
  )
}
