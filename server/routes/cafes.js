const router = require('express').Router()
const Cafe   = require('../models/Cafe')
const { cacheMiddleware } = require('../middleware/cache')

/**
 * GET /api/cafes
 * Query params:
 *   sort        — 'rating' | 'nearest' | 'price' | 'open'
 *   amenities   — comma-separated: 'wifi,ac,outlet'
 *   maxDist     — meters (requires lat/lng)
 *   price       — '0-50000' | '50000-100000' | '100000+'
 *   lat, lng    — geolocation for $geoNear
 *   limit       — default 20, max 50
 *   page        — default 1
 *   featured    — 'true' for featured only
 *   district    — district name filter
 */
router.get('/', cacheMiddleware(120), async (req, res, next) => {
  try {
    const {
      sort      = 'rating',
      amenities,
      district,
      maxDist,
      price,
      lng, lat,
      featured,
      q,
      limit = 20,
      page  = 1,
    } = req.query

    const lim = Math.min(+limit, 50)
    const skip = (+page - 1) * lim

    /* ── Build filter ── */
    const filter = {}
    if (district)  filter.district  = district
    if (featured === 'true') filter.featured = true
    if (amenities) {
      filter.amenities = { $in: amenities.split(',') }
    }

    /* Search query — regex for partial match */
    if (q && q.trim()) {
      const re = new RegExp(q.trim(), 'i')
      filter.$or = [
        { name:     { $regex: re } },
        { address:  { $regex: re } },
        { district: { $regex: re } },
        { tags:     { $regex: re } },
      ]
    }

    /* Price filter: minPrice field */
    if (price) {
      if (price === '0-50000')         filter.minPrice = { $lte: 50000 }
      else if (price === '50000-100000') filter.minPrice = { $gte: 50000, $lte: 100000 }
      else if (price === '100000+')    filter.minPrice = { $gte: 100000 }
    }

    let cafes, total

    /* ── Geo mode ── */
    if (lng && lat) {
      const geoNearStage = {
        $geoNear: {
          near:          { type: 'Point', coordinates: [+lng, +lat] },
          distanceField: 'distance',
          spherical:     true,
          query:         filter,
          ...(maxDist ? { maxDistance: +maxDist } : {}),
        },
      }

      const sortStage = sort === 'price'
        ? { $sort: { minPrice: 1 } }
        : sort === 'rating'
        ? { $sort: { rating: -1 } }
        : { $sort: { distance: 1 } }   // nearest

      const countResult = await Cafe.aggregate([geoNearStage, { $count: 'total' }])
      total = countResult[0]?.total || 0

      cafes = await Cafe.aggregate([
        geoNearStage,
        sortStage,
        { $skip: skip },
        { $limit: lim },
      ])
    } else {
      /* ── Normal mode ── */
      total = await Cafe.countDocuments(filter)

      const sortObj = sort === 'price'
        ? { minPrice: 1 }
        : sort === 'rating'
        ? { rating: -1 }
        : { createdAt: -1 }

      cafes = await Cafe
        .find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(lim)
        .lean()
    }

    res.json({ cafes, total, page: +page, limit: lim })
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/cafes/:id
 */
router.get('/:id', cacheMiddleware(300), async (req, res, next) => {
  try {
    const cafe = await Cafe.findById(req.params.id).lean()
    if (!cafe) return res.status(404).json({ message: 'Không tìm thấy quán' })
    res.json(cafe)
  } catch (err) {
    next(err)
  }
})

module.exports = router
