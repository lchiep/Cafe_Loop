/**
 * CafeLoop — Seed Script
 * Usage: node server/scripts/seed.js
 *
 * Thêm 20 quán cafe mẫu tại Hà Nội vào MongoDB.
 * CẢNH BÁO: xóa toàn bộ collection Cafe trước khi seed.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const mongoose = require('mongoose')
const Cafe     = require('../models/Cafe')

const SEED_CAFES = [
  {
    name:     'The Hideout Cafe',
    address:  '12 Hàng Bông, Hoàn Kiếm, Hà Nội',
    district: 'Hoàn Kiếm',
    location: { type: 'Point', coordinates: [105.8483, 21.0295] },
    rating:   4.8, ratingCount: 142,
    minPrice: 45000,
    openTime: '07:00', closeTime: '22:00', isOpen24h: false,
    images:   [],
    amenities: ['wifi', 'ac', 'outlet'],
    tags:     ['Yên tĩnh', 'Làm việc tốt', 'Giá vừa'],
    featured: true,
  },
  {
    name:     'Mây Xanh Cafe',
    address:  '5 Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội',
    district: 'Hoàn Kiếm',
    location: { type: 'Point', coordinates: [105.8528, 21.0325] },
    rating:   4.6, ratingCount: 89,
    minPrice: 35000,
    openTime: '06:30', closeTime: '23:00', isOpen24h: false,
    images:   [],
    amenities: ['wifi', 'outdoor'],
    tags:     ['View hồ', 'Ngoài trời', 'Đẹp cho check-in'],
    featured: false,
  },
  {
    name:     'Roots Cafe',
    address:  '22 Lý Quốc Sư, Hoàn Kiếm, Hà Nội',
    district: 'Hoàn Kiếm',
    location: { type: 'Point', coordinates: [105.8463, 21.0315] },
    rating:   4.9, ratingCount: 217,
    minPrice: 55000,
    openTime: '07:00', closeTime: '22:30', isOpen24h: false,
    images:   [],
    amenities: ['wifi', 'ac', 'outlet', 'parking'],
    tags:     ['Specialty Coffee', 'Yên tĩnh', 'Cao cấp'],
    featured: true,
  },
  {
    name:     'Sương Sớm',
    address:  '8 Lý Thái Tổ, Hoàn Kiếm, Hà Nội',
    district: 'Hoàn Kiếm',
    location: { type: 'Point', coordinates: [105.8540, 21.0358] },
    rating:   4.7, ratingCount: 103,
    minPrice: 40000,
    openTime: '06:00', closeTime: '21:00', isOpen24h: false,
    images:   [],
    amenities: ['wifi', 'outdoor'],
    tags:     ['Sáng sớm', 'View hồ Gươm', 'Cà phê trứng'],
    featured: false,
  },
  {
    name:     'Cộng Cà Phê Đinh Lễ',
    address:  '32 Đinh Lễ, Hoàn Kiếm, Hà Nội',
    district: 'Hoàn Kiếm',
    location: { type: 'Point', coordinates: [105.8555, 21.0297] },
    rating:   4.4, ratingCount: 356,
    minPrice: 35000,
    openTime: '07:00', closeTime: '23:00', isOpen24h: false,
    images:   [],
    amenities: ['wifi', 'ac'],
    tags:     ['Nổi tiếng', 'Retro', 'Cà phê cốt dừa'],
    featured: false,
  },
  {
    name:     'Café Lam',
    address:  '60 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội',
    district: 'Hoàn Kiếm',
    location: { type: 'Point', coordinates: [105.8517, 21.0349] },
    rating:   4.5, ratingCount: 78,
    minPrice: 30000,
    openTime: '06:00', closeTime: '22:00', isOpen24h: false,
    images:   [],
    amenities: ['wifi'],
    tags:     ['Lâu đời', 'Truyền thống', 'Rẻ'],
    featured: false,
  },
  {
    name:     'The Workshop',
    address:  '27 Tràng Tiền, Hoàn Kiếm, Hà Nội',
    district: 'Hoàn Kiếm',
    location: { type: 'Point', coordinates: [105.8571, 21.0268] },
    rating:   4.7, ratingCount: 194,
    minPrice: 60000,
    openTime: '07:30', closeTime: '22:00', isOpen24h: false,
    images:   [],
    amenities: ['wifi', 'ac', 'outlet'],
    tags:     ['Specialty', 'Industrial', 'Không gian rộng'],
    featured: true,
  },
  {
    name:     'Runam Bistro',
    address:  '69 Hàng Trống, Hoàn Kiếm, Hà Nội',
    district: 'Hoàn Kiếm',
    location: { type: 'Point', coordinates: [105.8508, 21.0307] },
    rating:   4.6, ratingCount: 128,
    minPrice: 65000,
    openTime: '07:00', closeTime: '22:30', isOpen24h: false,
    images:   [],
    amenities: ['wifi', 'ac', 'parking'],
    tags:     ['Cao cấp', 'Bistro', 'View đẹp'],
    featured: false,
  },
  {
    name:     'Nhà Sàn Cafe',
    address:  '3 Đặng Thai Mai, Tây Hồ, Hà Nội',
    district: 'Tây Hồ',
    location: { type: 'Point', coordinates: [105.8353, 21.0623] },
    rating:   4.8, ratingCount: 261,
    minPrice: 50000,
    openTime: '06:30', closeTime: '22:00', isOpen24h: false,
    images:   [],
    amenities: ['wifi', 'outdoor', 'parking'],
    tags:     ['Hồ Tây', 'Ngoài trời', 'Lãng mạn'],
    featured: true,
  },
  {
    name:     'Tranquil Books & Coffee',
    address:  '5 Nguyễn Quang Bích, Hoàn Kiếm, Hà Nội',
    district: 'Hoàn Kiếm',
    location: { type: 'Point', coordinates: [105.8445, 21.0341] },
    rating:   4.9, ratingCount: 87,
    minPrice: 45000,
    openTime: '08:00', closeTime: '21:30', isOpen24h: false,
    images:   [],
    amenities: ['wifi', 'ac', 'outlet'],
    tags:     ['Thư viện', 'Yên tĩnh', 'Đọc sách'],
    featured: false,
  },
  {
    name:     'Cafe Giang',
    address:  '39 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội',
    district: 'Hoàn Kiếm',
    location: { type: 'Point', coordinates: [105.8521, 21.0342] },
    rating:   4.5, ratingCount: 432,
    minPrice: 25000,
    openTime: '07:00', closeTime: '22:00', isOpen24h: false,
    images:   [],
    amenities: [],
    tags:     ['Cà phê trứng', 'Huyền thoại', 'Rẻ'],
    featured: false,
  },
  {
    name:     'Loading T Cafe',
    address:  '14 Tông Đản, Hoàn Kiếm, Hà Nội',
    district: 'Hoàn Kiếm',
    location: { type: 'Point', coordinates: [105.8536, 21.0280] },
    rating:   4.3, ratingCount: 65,
    minPrice: 35000,
    openTime: '08:00', closeTime: '23:00', isOpen24h: false,
    images:   [],
    amenities: ['wifi', 'ac', 'outlet'],
    tags:     ['Tech', 'Gamer', 'Làm việc'],
    featured: false,
  },
  {
    name:     'Cafe Đinh',
    address:  '13 Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội',
    district: 'Hoàn Kiếm',
    location: { type: 'Point', coordinates: [105.8530, 21.0329] },
    rating:   4.4, ratingCount: 195,
    minPrice: 30000,
    openTime: '06:30', closeTime: '22:30', isOpen24h: false,
    images:   [],
    amenities: ['wifi'],
    tags:     ['View Hồ Gươm', 'Cổ điển', 'Rẻ'],
    featured: false,
  },
  {
    name:     'Ocha Cafe',
    address:  '28 Hàng Bài, Hoàn Kiếm, Hà Nội',
    district: 'Hoàn Kiếm',
    location: { type: 'Point', coordinates: [105.8564, 21.0244] },
    rating:   4.6, ratingCount: 114,
    minPrice: 50000,
    openTime: '07:30', closeTime: '22:00', isOpen24h: false,
    images:   [],
    amenities: ['wifi', 'ac', 'outlet'],
    tags:     ['Nhật Bản', 'Matcha', 'Yên tĩnh'],
    featured: false,
  },
  {
    name:     'Boncha Cafe',
    address:  '18 Quán Thánh, Ba Đình, Hà Nội',
    district: 'Ba Đình',
    location: { type: 'Point', coordinates: [105.8427, 21.0363] },
    rating:   4.5, ratingCount: 92,
    minPrice: 40000,
    openTime: '07:00', closeTime: '22:00', isOpen24h: false,
    images:   [],
    amenities: ['wifi', 'ac', 'outdoor'],
    tags:     ['Vintage', 'Ngoài trời', 'Check-in đẹp'],
    featured: false,
  },
  {
    name:     'Egg Cafe Hanoi',
    address:  '110 Đinh Lễ, Hoàn Kiếm, Hà Nội',
    district: 'Hoàn Kiếm',
    location: { type: 'Point', coordinates: [105.8561, 21.0289] },
    rating:   4.4, ratingCount: 178,
    minPrice: 35000,
    openTime: '07:00', closeTime: '22:00', isOpen24h: false,
    images:   [],
    amenities: ['wifi', 'ac'],
    tags:     ['Cà phê trứng', 'Du lịch', 'Nổi tiếng'],
    featured: false,
  },
  {
    name:     'Nola Cafe',
    address:  '89 Mã Mây, Hoàn Kiếm, Hà Nội',
    district: 'Hoàn Kiếm',
    location: { type: 'Point', coordinates: [105.8495, 21.0358] },
    rating:   4.7, ratingCount: 143,
    minPrice: 55000,
    openTime: '08:00', closeTime: '22:30', isOpen24h: false,
    images:   [],
    amenities: ['wifi', 'ac', 'outlet', 'pet'],
    tags:     ['Pet-friendly', 'Phố cổ', 'Sang trọng'],
    featured: true,
  },
  {
    name:     'My Way Cafe',
    address:  '22 Tạ Hiện, Hoàn Kiếm, Hà Nội',
    district: 'Hoàn Kiếm',
    location: { type: 'Point', coordinates: [105.8503, 21.0368] },
    rating:   4.3, ratingCount: 67,
    minPrice: 30000,
    openTime: '07:00', closeTime: '00:00', isOpen24h: false,
    images:   [],
    amenities: ['wifi', 'outdoor'],
    tags:     ['Phố Tây', 'Bia', 'Đêm khuya'],
    featured: false,
  },
  {
    name:     'Cafe 7 Dốc Thọ Lão',
    address:  '7 Dốc Thọ Lão, Hoàn Kiếm, Hà Nội',
    district: 'Hoàn Kiếm',
    location: { type: 'Point', coordinates: [105.8471, 21.0321] },
    rating:   4.8, ratingCount: 56,
    minPrice: 40000,
    openTime: '07:00', closeTime: '21:00', isOpen24h: false,
    images:   [],
    amenities: ['wifi', 'ac'],
    tags:     ['Hidden gem', 'Yên tĩnh', 'Phong cách riêng'],
    featured: false,
  },
  {
    name:     'Nox Cafe 24h',
    address:  '45 Hàng Bông, Hoàn Kiếm, Hà Nội',
    district: 'Hoàn Kiếm',
    location: { type: 'Point', coordinates: [105.8475, 21.0301] },
    rating:   4.2, ratingCount: 201,
    minPrice: 35000,
    openTime: '00:00', closeTime: '23:59', isOpen24h: true,
    images:   [],
    amenities: ['wifi', 'ac', 'outlet'],
    tags:     ['24h', 'Làm đêm', 'Thức khuya'],
    featured: false,
  },
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected')

    // Clear existing
    const deleted = await Cafe.deleteMany({})
    console.log(`🗑  Đã xóa ${deleted.deletedCount} quán cũ`)

    // Insert new
    const inserted = await Cafe.insertMany(SEED_CAFES)
    console.log(`🌱 Đã thêm ${inserted.length} quán cafe mẫu`)

    // Show summary
    console.log('\n📋 Danh sách đã seed:')
    inserted.forEach((c, i) => {
      console.log(`  ${i + 1}. ${c.name} — ⭐${c.rating} — ${c.district}`)
    })

    console.log('\n✅ Seed hoàn tất!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seed thất bại:', err.message)
    process.exit(1)
  }
}

seed()
