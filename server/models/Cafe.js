const { Schema, model } = require('mongoose')

const cafeSchema = new Schema({
  name:     { type: String, required: true, trim: true },
  address:  { type: String, required: true },
  district: { type: String, required: true },

  location: {
    type:        { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true },
  },

  rating:      { type: Number, default: 0, min: 0, max: 5 },
  ratingCount: { type: Number, default: 0 },
  minPrice:    { type: Number, default: 0 },

  openTime:  { type: String, default: '07:00' },
  closeTime: { type: String, default: '22:00' },
  isOpen24h: { type: Boolean, default: false },

  images:    [String],   // ảnh quán
  drinks:    [String],   // ảnh đồ uống / menu ← THÊM MỚI
  amenities: [String],
  tags:      [String],

  featured: { type: Boolean, default: false },
  owner:    { type: Schema.Types.ObjectId, ref: 'User' },

}, { timestamps: true })

cafeSchema.index({ location: '2dsphere' })
cafeSchema.index({ name: 'text', address: 'text', tags: 'text' })

module.exports = model('Cafe', cafeSchema)
