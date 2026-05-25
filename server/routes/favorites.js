const router = require('express').Router()
const jwt    = require('jsonwebtoken')
const User   = require('../models/User')
const Cafe   = require('../models/Cafe')

/* ── Auth middleware (inline, lightweight) ── */
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

/**
 * GET /api/favorites — lấy danh sách quán yêu thích của user
 */
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).lean()
    if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' })

    const cafes = await Cafe
      .find({ _id: { $in: user.favorites || [] } })
      .lean()

    res.json({ cafes, total: cafes.length })
  } catch (err) {
    next(err)
  }
})

/**
 * POST /api/favorites/:cafeId — toggle yêu thích (add nếu chưa có, remove nếu có)
 * Returns: { favorited: boolean }
 */
router.post('/:cafeId', requireAuth, async (req, res, next) => {
  try {
    const { cafeId } = req.params
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' })

    const idx = user.favorites?.findIndex(f => f.toString() === cafeId) ?? -1

    if (idx === -1) {
      /* Add to favorites */
      user.favorites = [...(user.favorites || []), cafeId]
      await user.save()
      res.json({ favorited: true })
    } else {
      /* Remove from favorites */
      user.favorites.splice(idx, 1)
      await user.save()
      res.json({ favorited: false })
    }
  } catch (err) {
    next(err)
  }
})

module.exports = router
