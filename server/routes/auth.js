const router  = require('express').Router()
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const { z }   = require('zod')
const rateLimit = require('express-rate-limit')
const User    = require('../models/User')

/* ── Rate limit: 10 attempts / 15 min per IP ── */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Quá nhiều lần thử. Vui lòng chờ 15 phút.' },
})

const registerSchema = z.object({
  name:     z.string().min(2).max(50),
  email:    z.string().email(),
  password: z.string().min(6),
})

/* ── POST /api/auth/register ── */
router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body)

    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ message: 'Email đã được sử dụng' })

    const hash = await bcrypt.hash(password, 12)
    const user = await User.create({ name, email, password: hash })

    const token = signToken(user._id)
    setCookie(res, token)

    res.status(201).json({ _id: user._id, name: user.name, email: user.email })
  } catch (err) {
    next(err)
  }
})

/* ── POST /api/auth/login ── */
router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    const valid = user && await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' })

    const token = signToken(user._id)
    setCookie(res, token)

    res.json({ _id: user._id, name: user.name, email: user.email })
  } catch (err) {
    next(err)
  }
})

/* ── POST /api/auth/logout ── */
router.post('/logout', (_, res) => {
  res.clearCookie('token')
  res.json({ message: 'Đã đăng xuất' })
})

/* ── GET /api/auth/me ── */
router.get('/me', async (req, res, next) => {
  try {
    const token = req.cookies?.token
    if (!token) return res.status(401).json({ message: 'Chưa đăng nhập' })

    const { id } = jwt.verify(token, process.env.JWT_SECRET)
    const user   = await User.findById(id).lean()
    if (!user)   return res.status(401).json({ message: 'Tài khoản không tồn tại' })

    res.json({ _id: user._id, name: user.name, email: user.email })
  } catch {
    res.status(401).json({ message: 'Token không hợp lệ' })
  }
})

/* ── Helpers ── */
function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function setCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   7 * 24 * 60 * 60 * 1000,   // 7 days
  })
}

module.exports = router
