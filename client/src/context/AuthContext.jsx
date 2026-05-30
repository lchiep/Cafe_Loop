import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi, favoriteApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,      setUser]      = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [favorites, setFavorites] = useState(new Set()) // Set of cafeId strings

  /* ── Check session on mount ── */
  useEffect(() => {
    authApi.me()
      .then(u => {
        setUser(u)
        // Load favorites ngay khi có user
        return favoriteApi.list()
      })
      .then(data => {
        const ids = (data.cafes || []).map(c => c._id.toString())
        setFavorites(new Set(ids))
      })
      .catch(() => {
        setUser(null)
        setFavorites(new Set())
      })
      .finally(() => setLoading(false))
  }, [])

  async function login(data) {
    const u = await authApi.login(data)
    setUser(u)
    // Load favorites sau khi login
    try {
      const favData = await favoriteApi.list()
      const ids = (favData.cafes || []).map(c => c._id.toString())
      setFavorites(new Set(ids))
    } catch {}
  }

  async function logout() {
    await authApi.logout()
    setUser(null)
    setFavorites(new Set())
  }

  /* ── Toggle favorite — cập nhật global state ngay lập tức ── */
  const toggleFavorite = useCallback(async (cafeId) => {
    if (!user) return false

    const id = cafeId.toString()
    const isFav = favorites.has(id)

    // Optimistic update — cập nhật UI ngay
    setFavorites(prev => {
      const next = new Set(prev)
      if (isFav) next.delete(id)
      else next.add(id)
      return next
    })

    try {
      if (isFav) await favoriteApi.remove(id)
      else await favoriteApi.add(id)
      return !isFav
    } catch {
      // Rollback nếu lỗi
      setFavorites(prev => {
        const next = new Set(prev)
        if (isFav) next.add(id)
        else next.delete(id)
        return next
      })
      return isFav
    }
  }, [user, favorites])

  const isFavorite = useCallback((cafeId) => {
    return favorites.has(cafeId?.toString())
  }, [favorites])

  return (
    <AuthContext.Provider value={{
      user, loading, login, logout,
      favorites, toggleFavorite, isFavorite,
      favCount: favorites.size,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
