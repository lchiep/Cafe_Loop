import axios from 'axios'

const http = axios.create({
  baseURL:         import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
  timeout:         12_000,
})

http.interceptors.response.use(
  (res) => res.data,
  (error) => {
    const msg = error.response?.data?.message || 'Lỗi kết nối máy chủ'
    return Promise.reject(new Error(msg))
  }
)

/* ── Cafe ── */
export const cafeApi = {
  list:    (params) => http.get('/api/cafes', { params }),
  getById: (id)     => http.get(`/api/cafes/${id}`),
  search:  (q, extra = {}) => http.get('/api/search', { params: { q, ...extra } }),
}

/* ── Auth ── */
export const authApi = {
  register: (data) => http.post('/api/auth/register', data),
  login:    (data) => http.post('/api/auth/login', data),
  logout:   ()     => http.post('/api/auth/logout'),
  me:       ()     => http.get('/api/auth/me'),
}

/* ── Reviews ── */
export const reviewApi = {
  list:   (cafeId) => http.get(`/api/reviews/${cafeId}`),
  create: (data)   => http.post('/api/reviews', data),
}

/* ── Favorites ── */
export const favoriteApi = {
  list:   ()         => http.get('/api/favorites'),
  check:  (cafeId)   => http.get(`/api/favorites/check/${cafeId}`),
  add:    (cafeId)   => http.post(`/api/favorites/add/${cafeId}`),
  remove: (cafeId)   => http.post(`/api/favorites/remove/${cafeId}`),
  toggle: (cafeId)   => http.post(`/api/favorites/${cafeId}`),
}

export default http
