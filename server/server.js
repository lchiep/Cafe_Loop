require('dotenv').config()

const express      = require('express')
const cors         = require('cors')
const cookieParser = require('cookie-parser')
const mongoose     = require('mongoose')

const cafeRoutes      = require('./routes/cafes')
const searchRoutes    = require('./routes/search')
const reviewRoutes    = require('./routes/reviews')
const authRoutes      = require('./routes/auth')
const favoriteRoutes  = require('./routes/favorites')
const { errorHandler } = require('./middleware/errorHandler')

const app  = express()
const PORT = process.env.PORT || 5000

/* ── Middleware ── */
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

/* ── Routes ── */
app.use('/api/cafes',     cafeRoutes)
app.use('/api/search',    searchRoutes)
app.use('/api/reviews',   reviewRoutes)
app.use('/api/auth',      authRoutes)
app.use('/api/favorites', favoriteRoutes)

/* ── Health check (Render keep-alive) ── */
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

/* ── Global error handler ── */
app.use(errorHandler)

/* ── Connect DB then start ── */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(PORT, () => console.log(`🚀 CafeLoop server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error('❌ DB connection failed:', err.message)
    process.exit(1)
  })
