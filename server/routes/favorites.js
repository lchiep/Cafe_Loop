const router = require('express').Router()
const jwt    = require('jsonwebtoken')
const User   = require('../models/User')
const Cafe   = require('../models/Cafe')

/* ── Auth middleware ── */
function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token
    if (!token) return res.status(401).json({ message: 'Chưa đăng nhập' })
    const { id } = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = id
    next()
  } catch {
    res.status(401).json({ message: 'Token không hợp lệ' })
  }
}

/* GET /api/favorites — danh sách yêu thích */
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).lean()
    if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' })
    const cafes = await Cafe.find({ _id: { $in: user.favorites || [] } }).lean()
    res.json({ cafes, total: cafes.length })
  } catch (err) { next(err) }
})

/* GET /api/favorites/check/:cafeId — kiểm tra đã yêu thích chưa */
router.get('/check/:cafeId', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).lean()
    const favorited = user?.favorites?.some(f => f.toString() === req.params.cafeId) ?? false
    res.json({ favorited })
  } catch (err) { next(err) }
})

/* POST /api/favorites/add/:cafeId — thêm yêu thích */
router.post('/add/:cafeId', requireAuth, async (req, res, next) => {
  try {
    const { cafeId } = req.params
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' })
    if (!user.favorites) user.favorites = []
    if (!user.favorites.some(f => f.toString() === cafeId)) {
      user.favorites.push(cafeId)
      await user.save()
    }
    res.json({ favorited: true })
  } catch (err) { next(err) }
})

/* POST /api/favorites/remove/:cafeId — xóa yêu thích */
router.post('/remove/:cafeId', requireAuth, async (req, res, next) => {
  try {
    const { cafeId } = req.params
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' })
    user.favorites = (user.favorites || []).filter(f => f.toString() !== cafeId)
    await user.save()
    res.json({ favorited: false })
  } catch (err) { next(err) }
})

/* POST /api/favorites/:cafeId — toggle (giữ backward compat) */
router.post('/:cafeId', requireAuth, async (req, res, next) => {
  try {
    const { cafeId } = req.params
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' })
    if (!user.favorites) user.favorites = []
    const idx = user.favorites.findIndex(f => f.toString() === cafeId)
    if (idx === -1) { user.favorites.push(cafeId); await user.save(); return res.json({ favorited: true }) }
    user.favorites.splice(idx, 1); await user.save(); res.json({ favorited: false })
  } catch (err) { next(err) }
})

module.exports = router
