// models/User.js
const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true, select: false },
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Cafe' }],
  avatar:    String,
}, { timestamps: true })

module.exports = model('User', userSchema)
