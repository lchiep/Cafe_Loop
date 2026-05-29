import { useState, useEffect } from 'react'

const HN_LAT = 21.0285
const HN_LNG = 105.8542

const WMO_ICON = {
  0:'☀️', 1:'🌤', 2:'⛅', 3:'☁️',
  45:'🌫', 48:'🌫', 51:'🌦', 53:'🌦', 55:'🌧',
  61:'🌧', 63:'🌧', 65:'🌧', 71:'🌨', 73:'🌨', 75:'❄️',
  80:'🌦', 81:'🌧', 82:'⛈', 95:'⛈', 96:'⛈', 99:'⛈',
}
const WMO_LABEL = {
  0:'Nắng đẹp', 1:'Ít mây', 2:'Có mây', 3:'Nhiều mây',
  45:'Sương mù', 48:'Sương mù', 51:'Mưa nhẹ', 53:'Mưa nhẹ', 55:'Mưa',
  61:'Mưa', 63:'Mưa vừa', 65:'Mưa to', 80:'Mưa rào', 81:'Mưa rào',
  82:'Dông', 95:'Dông', 96:'Dông', 99:'Dông',
}
const DAYS = ['CN','T2','T3','T4','T5','T6','T7']

/* iOS-style liquid glass */
const glass = [
  'bg-white/[0.08] backdrop-blur-2xl',
  'border border-white/[0.15]',
  'shadow-[0_8px_32px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.20)]',
  'rounded-2xl overflow-hidden relative',
].join(' ')

/* Big emoji icon with white glow */
const Icon = ({ code, size = 40 }) => (
  <span style={{
    fontSize: size,
    lineHeight: 1,
    filter: `brightness(0) invert(1) drop-shadow(0 0 ${Math.round(size/5)}px rgba(255,255,255,0.6))`,
    display: 'inline-block',
    opacity: 0.90,
  }}>
    {WMO_ICON[code] || '🌤'}
  </span>
)

export default function WeatherClock() {
  const [time,    setTime]    = useState(new Date())
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${HN_LAT}&longitude=${HN_LNG}` +
      `&current=temperature_2m,weathercode,windspeed_10m,winddirection_10m` +
      `&hourly=weathercode,temperature_2m` +
      `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
      `&timezone=Asia%2FBangkok&forecast_days=4`
    ).then(r => r.json()).then(setWeather).catch(() => {})
  }, [])

  const hh  = time.getHours().toString().padStart(2,'0')
  const mm  = time.getMinutes().toString().padStart(2,'0')
  const ss  = time.getSeconds().toString().padStart(2,'0')
  const h   = time.getHours()
  const session = h < 12 ? 'Buổi sáng' : h < 18 ? 'Buổi chiều' : 'Buổi tối'

  const secDeg  = time.getSeconds() * 6
  const minDeg  = time.getMinutes() * 6 + time.getSeconds() * 0.1
  const hourDeg = (h % 12) * 30 + time.getMinutes() * 0.5

  const curr  = weather?.current
  const daily = weather?.daily

  const nextHours = (() => {
    if (!weather?.hourly) return []
    const times = weather.hourly.time
    const codes = weather.hourly.weathercode
    const temps = weather.hourly.temperature_2m
    const idx   = times.findIndex(t => new Date(t) > new Date())
    if (idx < 0) return []
    return [0,1,2].map(i => ({
      label: `${new Date(times[idx+i]).getHours()}h`,
      code:  codes[idx+i],
      temp:  Math.round(temps[idx+i]),
    }))
  })()

  return (
    <div className="flex items-stretch px-5 py-6 max-w-7xl mx-auto"
      style={{ gap: 0 }}>

      {/* ══ CLOCK 25% ══ */}
      <div className={`${glass} flex flex-col items-center justify-center`}
        style={{ flex: '0 0 25%' }}>

        {/* aurora blobs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none"/>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-500/12 rounded-full blur-2xl pointer-events-none"/>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none"/>

        {/* Analog — fill ~55% of panel */}
        <svg viewBox="0 0 100 100" className="w-28 h-28 relative z-10 mb-3">
          {/* Outer glow */}
          <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2"/>
          {/* Face */}
          <circle cx="50" cy="50" r="44" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"/>
          {/* 60 ticks */}
          {Array.from({length:60}).map((_,i) => {
            const a    = (i*6-90)*Math.PI/180
            const big  = i%5===0
            const r1   = big ? 34 : 38
            const r2   = 41
            return <line key={i}
              x1={50+r1*Math.cos(a)} y1={50+r1*Math.sin(a)}
              x2={50+r2*Math.cos(a)} y2={50+r2*Math.sin(a)}
              stroke={big?'rgba(255,255,255,0.65)':'rgba(255,255,255,0.18)'}
              strokeWidth={big?2.5:0.9}
              strokeLinecap="round"/>
          })}
          {/* Hour */}
          <line x1="50" y1="50"
            x2={50+20*Math.cos((hourDeg-90)*Math.PI/180)}
            y2={50+20*Math.sin((hourDeg-90)*Math.PI/180)}
            stroke="white" strokeWidth="4" strokeLinecap="round"/>
          {/* Minute */}
          <line x1="50" y1="50"
            x2={50+30*Math.cos((minDeg-90)*Math.PI/180)}
            y2={50+30*Math.sin((minDeg-90)*Math.PI/180)}
            stroke="white" strokeWidth="3" strokeLinecap="round"/>
          {/* Second */}
          <line x1={50-7*Math.cos((secDeg-90)*Math.PI/180)}
            y1={50-7*Math.sin((secDeg-90)*Math.PI/180)}
            x2={50+33*Math.cos((secDeg-90)*Math.PI/180)}
            y2={50+33*Math.sin((secDeg-90)*Math.PI/180)}
            stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round"/>
          {/* Center dot */}
          <circle cx="50" cy="50" r="4" fill="#22d3ee"/>
          <circle cx="50" cy="50" r="2" fill="white"/>
        </svg>

        {/* Digital */}
        <p className="text-[38px] font-black text-white leading-none tracking-tight tabular-nums relative z-10 mb-1.5">
          {hh}:{mm}
        </p>
        <p className="text-[11px] text-white/40 font-semibold tracking-widest uppercase relative z-10">
          {session} · Hà Nội
        </p>
      </div>

      {/* gap 5% */}
      <div style={{ flex:'0 0 5%' }}/>

      {/* ══ WEATHER 35% ══ */}
      <div className={`${glass} flex flex-col items-center justify-center`}
        style={{ flex: '0 0 35%' }}>

        <div className="absolute -top-12 right-4 w-44 h-44 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"/>
        <div className="absolute -bottom-10 left-4 w-36 h-36 bg-blue-400/8 rounded-full blur-3xl pointer-events-none"/>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/28 to-transparent pointer-events-none"/>

        {curr ? (
          <div className="relative z-10 w-full px-10">

            {/* City */}
            <p className="text-center text-[11px] font-bold text-white/45 tracking-widest uppercase mb-3">
              Hà Nội
            </p>

            {/* Main: temp + icon */}
            <div className="flex items-center justify-center gap-5 mb-3">
              <p className="text-[52px] font-black text-white leading-none tabular-nums">
                {Math.round(curr.temperature_2m)}°
              </p>
              <Icon code={curr.weathercode} size={52}/>
            </div>

            {/* Status + wind */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <p className="text-[14px] font-semibold text-white/65">
                {WMO_LABEL[curr.weathercode]||'Trời đẹp'}
              </p>
              <span className="text-white/25">·</span>
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-white/45"
                  style={{transform:`rotate(${curr.winddirection_10m??0}deg)`}}
                  fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L8 10h3v10h2V10h3L12 2z"/>
                </svg>
                <span className="text-[13px] font-semibold text-white/45">
                  {Math.round(curr.windspeed_10m)} km/h
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10 mx-2 mb-4"/>

            {/* 3 giờ tiếp */}
            <div className="flex justify-around">
              {nextHours.map(({ label, code, temp }) => (
                <div key={label} className="flex flex-col items-center gap-1.5">
                  <p className="text-[11px] text-white/40 font-semibold">{label}</p>
                  <Icon code={code} size={26}/>
                  <p className="text-[13px] font-bold text-white/80">{temp}°</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"/>
        )}
      </div>

      {/* gap 5% */}
      <div style={{ flex:'0 0 5%' }}/>

      {/* ══ DAYS 30% ══ */}
      <div className={`${glass} flex flex-col justify-center`}
        style={{ flex: '0 0 30%' }}>

        <div className="absolute -top-10 right-0 w-36 h-36 bg-violet-400/8 rounded-full blur-3xl pointer-events-none"/>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"/>

        {daily ? [1,2,3].map((i, ri) => {
          const date = new Date(daily.time[i])
          const day  = i===1 ? 'Ngày mai' : DAYS[date.getDay()]
          const hi   = Math.round(daily.temperature_2m_max[i])
          const lo   = Math.round(daily.temperature_2m_min[i])
          return (
            <div key={i}>
              <div className="flex items-center px-8 py-4">
                {/* Day label */}
                <p className="text-[13px] font-semibold text-white/50 w-[90px] flex-shrink-0">{day}</p>
                {/* Icon — centered */}
                <div className="flex-1 flex justify-center">
                  <Icon code={daily.weathercode[i]} size={26}/>
                </div>
                {/* Temps right-aligned */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <p className="text-[14px] font-semibold text-white/35 tabular-nums">{lo}°</p>
                  <p className="text-[16px] font-black text-white tabular-nums">{hi}°</p>
                </div>
              </div>
              {ri < 2 && <div className="h-px bg-white/[0.08] mx-8"/>}
            </div>
          )
        }) : (
          <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto"/>
        )}
      </div>

    </div>
  )
}
