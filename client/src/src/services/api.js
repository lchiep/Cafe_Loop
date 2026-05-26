import axios from 'axios'

const http = axios.create({
  baseURL:         import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,       // httpOnly cookie JWT
  timeout:         12_000,
})

/* ── Response: normalize error messages ── */
http.interceptors.response.use(
  (res) => res.data,
  (error) => {
    const msg = error.response?.data?.message || 'Lỗi kết nối máy chủ'
    return Promise.reject(new Error(msg))
  }
)

/* ── Cafe endpoints ── */
export const cafeApi = {
  /**
   * GET /api/cafes
   * params: { q, sort, amenities, maxDist, price, lat, lng, limit, page, featured }
   * Returns: { cafes: [], total: N, page: N, limit: N }
   */
  list:    (params) => http.get('/api/cafes', { params }),

  /**
   * GET /api/cafes/:id
   * Returns: Cafe object
   */
  getById: (id)     => http.get(`/api/cafes/${id}`),

  /**
   * GET /api/search?q=...
   * Returns: { cafes: [], query: string }
   */
  search:  (q, extra = {}) => http.get('/api/search', { params: { q, ...extra } }),
}

/* ── Auth endpoints ── */
export const authApi = {
  register: (data) => http.post('/api/auth/register', data),
  login:    (data) => http.post('/api/auth/login', data),
  logout:   ()     => http.post('/api/auth/logout'),
  me:       ()     => http.get('/api/auth/me'),
}

/* ── Review endpoints ── */
export const reviewApi = {
  list:   (cafeId) => http.get(`/api/reviews/${cafeId}`),
  create: (data)   => http.post('/api/reviews', data),
}

/* ── Favorites ── */
export const favoriteApi = {
  list:   ()       => http.get('/api/favorites'),
  toggle: (cafeId) => http.post(`/api/favorites/${cafeId}`),
}

export default http
