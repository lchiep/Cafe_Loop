const router = require('express').Router()
const Cafe   = require('../models/Cafe')
const { cacheMiddleware } = require('../middleware/cache')

/**
 * GET /api/search?q=hideout&lng=105.85&lat=21.02
 * Full-text search + optional geo sort
 * Cache: 2 phút
 */
router.get('/', cacheMiddleware(120), async (req, res, next) => {
  try {
    const { q = '', lng, lat, limit = 20 } = req.query

    if (q.length < 2) return res.json({ cafes: [] })

    /* Full-text search via MongoDB text index */
    const textFilter = { $text: { $search: q } }

    let cafes
    if (lng && lat) {
      cafes = await Cafe.aggregate([
        { $match: textFilter },
        { $addFields: { score: { $meta: 'textScore' } } },
        {
          $geoNear: {
            near:          { type: 'Point', coordinates: [+lng, +lat] },
            distanceField: 'distance',
            spherical:     true,
          },
        },
        { $sort:  { distance: 1 } },
        { $limit: +limit },
      ])
    } else {
      cafes = await Cafe
        .find(textFilter, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(+limit)
        .lean()
    }

    res.json({ cafes, query: q })
  } catch (err) {
    next(err)
  }
})

module.exports = router
