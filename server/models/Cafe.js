const { Schema, model } = require('mongoose')

const cafeSchema = new Schema({
  name:     { type: String, required: true, trim: true },
  address:  { type: String, required: true },
  district: { type: String, required: true },

  /* Geo — enables $near queries */
  location: {
    type:        { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },

  rating:    { type: Number, default: 0, min: 0, max: 5 },
  ratingCount: { type: Number, default: 0 },
  minPrice:  { type: Number, default: 0 },

  openTime:  { type: String, default: '07:00' },
  closeTime: { type: String, default: '22:00' },
  isOpen24h: { type: Boolean, default: false },

  images:    [String],       // Cloudinary URLs
  amenities: [String],       // ['wifi', 'ac', 'parking', ...]
  tags:      [String],

  featured:  { type: Boolean, default: false },
  owner:     { type: Schema.Types.ObjectId, ref: 'User' },

}, { timestamps: true })

/* ── Geo index ── */
cafeSchema.index({ location: '2dsphere' })

/* ── Text search index ── */
cafeSchema.index({ name: 'text', address: 'text', tags: 'text' })

module.exports = model('Cafe', cafeSchema)
