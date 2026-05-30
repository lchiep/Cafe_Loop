const router = require('express').Router()
const Cafe   = require('../models/Cafe')

/**
 * GET /api/search?q=xofa
 * - Nếu q >= 3 ký tự: dùng MongoDB $text full-text search (nhanh, có index)
 * - Nếu q < 3 ký tự: dùng regex prefix match (cho phép tìm từ ký tự đầu tiên)
 * Không cache để luôn fresh
 */
router.get('/', async (req, res, next) => {
  try {
    const { q = '', limit = 8 } = req.query
    const trimmed = q.trim()

    if (!trimmed) return res.json({ cafes: [], query: '' })

    let cafes

    if (trimmed.length >= 3) {
      // Full-text search (dùng text index — nhanh nhất)
      try {
        cafes = await Cafe
          .find(
            { $text: { $search: trimmed } },
            { score: { $meta: 'textScore' } }
          )
          .sort({ score: { $meta: 'textScore' } })
          .limit(+limit)
          .lean()
      } catch {
        // Fallback nếu text index chưa có
        cafes = []
      }

      // Nếu text search không ra kết quả, fallback regex
      if (!cafes.length) {
        cafes = await Cafe
          .find({ name: { $regex: trimmed, $options: 'i' } })
          .limit(+limit)
          .lean()
      }
    } else {
      // < 3 ký tự: regex prefix trên name, address, district
      const re = new RegExp(trimmed, 'i')
      cafes = await Cafe
        .find({
          $or: [
            { name:     { $regex: re } },
            { address:  { $regex: re } },
            { district: { $regex: re } },
            { tags:     { $regex: re } },
          ]
        })
        .sort({ rating: -1 })
        .limit(+limit)
        .lean()
    }

    res.json({ cafes, query: trimmed })
  } catch (err) {
    next(err)
  }
})

module.exports = router
