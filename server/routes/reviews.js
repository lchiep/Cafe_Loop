const router = require('express').Router()
const { Schema, model } = require('mongoose')

const reviewSchema = new Schema({
  cafe:   { type: Schema.Types.ObjectId, ref: 'Cafe', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  stars:  { type: Number, min: 1, max: 5, required: true },
  text:   { type: String, required: true, maxlength: 500 },
}, { timestamps: true })

const Review = model('Review', reviewSchema)

/* GET /api/reviews/:cafeId */
router.get('/:cafeId', async (req, res, next) => {
  try {
    const reviews = await Review
      .find({ cafe: req.params.cafeId })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(20)
      .lean()
    res.json(reviews)
  } catch (err) {
    next(err)
  }
})

module.exports = router
