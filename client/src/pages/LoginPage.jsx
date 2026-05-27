import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/* ── Ảnh background từ các quán cafe (chỉ ảnh số) ── */
const BG_IMAGES = [
  '/img/Aries Rooftop Coffee/0.jpg',
  '/img/Bonjour Cafe/1.jpg',
  '/img/Cii Coffee - Tay Son/0.jpg',
  '/img/Contrast Coffee/0.jpg',
  '/img/Lofi Lab/0.jpg',
  '/img/OK Coffee/0.jpg',
  '/img/Paradise Rooftop/0.jpg',
  '/img/Podcast Coffee/0.jpg',
  '/img/Starbucks - QT/0.jpg',
  '/img/Top of Ha Noi/0.jpg',
  '/img/TwoTrees/0.jpg',
  '/img/Ura Cafe/0.jpg',
  '/img/WannaTe Cocktail Bar/0.jpg',
  '/img/Xofa Cafe & Bistro/0.jpg',
]

const SOCIAL = [
  {
    name: 'Google',
    color: 'hover:bg-white/15',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    color: 'hover:bg-[#1877F2]/20',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    color: 'hover:bg-white/10',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.73a8.17 8.17 0 004.77 1.53V6.82a4.85 4.85 0 01-1-.13z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    color: 'hover:bg-white/10',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <defs>
          <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f09433"/>
            <stop offset="25%" stopColor="#e6683c"/>
            <stop offset="50%" stopColor="#dc2743"/>
            <stop offset="75%" stopColor="#cc2366"/>
            <stop offset="100%" stopColor="#bc1888"/>
          </linearGradient>
        </defs>
        <path fill="url(#ig)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [mode,     setMode]     = useState('login')   // 'login' | 'register'
  const [bgIdx,    setBgIdx]    = useState(0)
  const [prevIdx,  setPrevIdx]  = useState(null)
  const [sliding,  setSliding]  = useState(false)     // panel slide animation

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [name,     setName]     = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [showPass, setShowPass] = useState(false)

  /* ── Auto slideshow background ── */
  useEffect(() => {
    const t = setInterval(() => {
      setPrevIdx(i => bgIdx)
      setBgIdx(i => (i + 1) % BG_IMAGES.length)
    }, 4000)
    return () => clearInterval(t)
  }, [bgIdx])

  /* ── Switch mode với slide ── */
  function switchMode(m) {
    if (m === mode) return
    setSliding(true)
    setError('')
    setTimeout(() => {
      setMode(m)
      setSliding(false)
    }, 300)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login({ email, password })
        navigate('/')
      } else {
        // register — gọi API
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name, email, password }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Đăng ký thất bại')
        await login({ email, password })
        navigate('/')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex overflow-hidden bg-slate-950">

      {/* ── Left: Background slideshow ── */}
      <div className="hidden lg:block lg:w-[55%] relative overflow-hidden">

        {/* Images */}
        {BG_IMAGES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === bgIdx ? 1 : 0, zIndex: i === bgIdx ? 2 : 1 }}
          >
            <img src={src} alt="" className="w-full h-full object-cover"
              onError={e => { e.target.style.display = 'none' }}
            />
          </div>
        ))}

        {/* Overlays */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/30 via-transparent to-slate-950/60"/>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"/>

        {/* Brand overlay */}
        <div className="absolute bottom-10 left-10 z-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-[0_4px_20px_rgba(6,182,212,0.5)]">
              <span className="text-white font-black text-lg">C</span>
            </div>
            <span className="text-white font-bold text-[22px] tracking-tight">
              Cafe<span className="text-cyan-400">Loop</span>
            </span>
          </div>
          <p className="text-white/60 text-[14px] font-medium max-w-xs leading-relaxed">
            Khám phá hàng trăm quán cafe độc đáo tại Hà Nội — tìm không gian hoàn hảo cho bạn.
          </p>
        </div>

        {/* Dot nav */}
        <div className="absolute bottom-10 right-10 z-20 flex gap-1.5">
          {BG_IMAGES.map((_, i) => (
            <button key={i} onClick={() => setBgIdx(i)}
              className={`h-1 rounded-full transition-all duration-300
                ${i === bgIdx ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      {/* ── Right: Auth panel ── */}
      <div className="
        w-full lg:w-[45%] flex items-center justify-center
        bg-gradient-to-b from-slate-950 to-slate-900
        px-6 py-10 relative overflow-hidden
      ">

        {/* Subtle mesh background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-blue-500/5 blur-3xl"/>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-cyan-400/5 blur-3xl"/>
        </div>

        <div className="w-full max-w-sm relative z-10">

          {/* Logo — mobile */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-[0_4px_20px_rgba(6,182,212,0.4)]">
              <span className="text-white font-black text-base">C</span>
            </div>
            <span className="text-white font-bold text-[20px]">
              Cafe<span className="text-cyan-400">Loop</span>
            </span>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-2xl mb-8">
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => switchMode(m)}
                className={`
                  flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200
                  ${mode === m
                    ? 'bg-white/12 text-white shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/15'
                    : 'text-white/40 hover:text-white/70'
                  }
                `}>
                {m === 'login' ? 'Đăng nhập' : 'Đăng ký'}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div className={`mb-7 transition-all duration-300 ${sliding ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
            <h1 className="text-[26px] font-bold text-white leading-tight">
              {mode === 'login' ? 'Chào mừng trở lại 👋' : 'Tạo tài khoản mới ✨'}
            </h1>
            <p className="text-[13px] text-white/45 mt-1.5">
              {mode === 'login'
                ? 'Đăng nhập để lưu quán yêu thích của bạn'
                : 'Tham gia cộng đồng café lovers Hà Nội'}
            </p>
          </div>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {SOCIAL.map(({ name, icon, color }) => (
              <button key={name}
                className={`
                  flex items-center justify-center gap-2.5
                  py-2.5 rounded-xl border border-white/10
                  text-[12px] font-semibold text-white/80
                  bg-white/5 ${color}
                  transition-all duration-150 hover:border-white/20 hover:text-white
                  hover:-translate-y-0.5 active:translate-y-0
                `}
              >
                {icon}
                <span>{name}</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10"/>
            <span className="text-[11px] text-white/30 font-medium">hoặc dùng email</span>
            <div className="flex-1 h-px bg-white/10"/>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}
            className={`flex flex-col gap-3 transition-all duration-300 ${sliding ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}
          >
            {/* Name — register only */}
            {mode === 'register' && (
              <div className="relative">
                <input
                  value={name} onChange={e => setName(e.target.value)}
                  placeholder="Họ và tên"
                  required
                  className="
                    w-full bg-white/6 border border-white/12
                    rounded-xl px-4 py-3 pl-11
                    text-[13px] text-white placeholder-white/30
                    outline-none focus:border-cyan-400/50 focus:bg-white/10
                    transition-all duration-200
                  "
                />
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Email của bạn"
                required
                className="
                  w-full bg-white/6 border border-white/12
                  rounded-xl px-4 py-3 pl-11
                  text-[13px] text-white placeholder-white/30
                  outline-none focus:border-cyan-400/50 focus:bg-white/10
                  transition-all duration-200
                "
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                required
                className="
                  w-full bg-white/6 border border-white/12
                  rounded-xl px-4 py-3 pl-11 pr-11
                  text-[13px] text-white placeholder-white/30
                  outline-none focus:border-cyan-400/50 focus:bg-white/10
                  transition-all duration-200
                "
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <button type="button" onClick={() => setShowPass(s => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                {showPass
                  ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                  : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                }
              </button>
            </div>

            {/* Forgot password */}
            {mode === 'login' && (
              <div className="text-right -mt-1">
                <button type="button" className="text-[11px] text-white/35 hover:text-cyan-400 transition-colors">
                  Quên mật khẩu?
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="px-4 py-2.5 bg-rose-500/15 border border-rose-500/25 rounded-xl">
                <p className="text-[12px] text-rose-400 font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="
                w-full py-3.5 rounded-xl mt-1
                bg-gradient-to-r from-cyan-400 to-blue-500
                text-[14px] font-bold text-white
                shadow-[0_4px_20px_rgba(6,182,212,0.45)]
                hover:brightness-110 hover:-translate-y-0.5
                active:translate-y-0 active:brightness-100
                transition-all duration-150
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              "
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
                : mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'
              }
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-[12px] text-white/30 mt-6">
            {mode === 'login' ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
            <button onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
              {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </p>

          {/* Back to home */}
          <div className="text-center mt-5">
            <Link to="/" className="text-[11px] text-white/20 hover:text-white/50 transition-colors">
              ← Về trang chủ không cần đăng nhập
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
