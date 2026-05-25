const { createClient } = require('redis')

let redis

/* ── Connect Redis once (lazy init) ── */
async function getRedis() {
  if (!redis) {
    redis = createClient({ url: process.env.REDIS_URL })
    redis.on('error', (err) => console.warn('Redis warning:', err.message))
    await redis.connect()
  }
  return redis
}

/**
 * Cache middleware — stores API response in Redis for `ttl` seconds.
 * Key: full request URL (path + query string).
 */
function cacheMiddleware(ttl = 300) {
  return async (req, res, next) => {
    /* Skip cache if Redis not configured */
    if (!process.env.REDIS_URL) return next()

    try {
      const client = await getRedis()
      const key    = `cache:${req.originalUrl}`
      const cached = await client.get(key)

      if (cached) {
        return res.json(JSON.parse(cached))
      }

      /* Intercept res.json to save to cache */
      const original = res.json.bind(res)
      res.json = (data) => {
        client.setEx(key, ttl, JSON.stringify(data)).catch(() => {})
        return original(data)
      }

      next()
    } catch {
      /* Cache failure: proceed without cache */
      next()
    }
  }
}

module.exports = { cacheMiddleware }
