import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

const THEMES = {
  dark: {
    '--navy':      '#0f172a',
    '--navy-2':    '#1e293b',
    '--primary':   '#3b82f6',
    '--primary-dk':'#2563eb',
    '--primary-lt':'#eff6ff',
    '--teal':      '#06b6d4',
    '--surface':   '#ffffff',
    '--surface-2': '#f8fafc',
    '--surface-3': '#f1f5f9',
    '--border':    '#e2e8f0',
    '--muted':     '#94a3b8',
    '--text':      '#1e293b',
    bodyBg:        '#f8fafc',
  },
  blue: {
    '--navy':      '#0a1628',
    '--navy-2':    '#0f2044',
    '--primary':   '#60a5fa',
    '--primary-dk':'#3b82f6',
    '--primary-lt':'#dbeafe',
    '--teal':      '#38bdf8',
    '--surface':   '#ffffff',
    '--surface-2': '#f0f7ff',
    '--surface-3': '#e0f0ff',
    '--border':    '#bfdbfe',
    '--muted':     '#7cb3d4',
    '--text':      '#0f2044',
    bodyBg:        '#f0f7ff',
  },
  auto: {
    // same as dark — detected via prefers-color-scheme at runtime
    '--navy':      '#0f172a',
    '--navy-2':    '#1e293b',
    '--primary':   '#3b82f6',
    '--primary-dk':'#2563eb',
    '--primary-lt':'#eff6ff',
    '--teal':      '#06b6d4',
    '--surface':   '#ffffff',
    '--surface-2': '#f8fafc',
    '--surface-3': '#f1f5f9',
    '--border':    '#e2e8f0',
    '--muted':     '#94a3b8',
    '--text':      '#1e293b',
    bodyBg:        '#f8fafc',
  },
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('cafeloop_theme') || 'dark')
  const [lang,  setLang]  = useState(() => localStorage.getItem('cafeloop_lang')  || 'vi')

  useEffect(() => {
    const vars = THEMES[theme] || THEMES.dark
    const root = document.documentElement
    Object.entries(vars).forEach(([k, v]) => {
      if (k !== 'bodyBg') root.style.setProperty(k, v)
    })
    document.body.style.background = vars.bodyBg
    localStorage.setItem('cafeloop_theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('cafeloop_lang', lang)
    document.documentElement.setAttribute('lang', lang)
  }, [lang])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, lang, setLang }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
