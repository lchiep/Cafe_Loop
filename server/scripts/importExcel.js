require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const mongoose = require('mongoose')
const XLSX     = require('xlsx')
const path     = require('path')
const Cafe     = require('../models/Cafe')

const FILE = process.argv[2]
  || path.join(__dirname, '../../client/public/cafeloop-cafes-v2.xlsx')

async function run() {
  console.log(`\n📂 Đọc file: ${FILE}`)
  const wb = XLSX.readFile(FILE)
  const ws = wb.Sheets['Cafes']
  if (!ws) {
    console.error('❌ Không tìm thấy sheet "Cafes"')
    process.exit(1)
  }

  const raw = XLSX.utils.sheet_to_json(ws, { defval: '' })

  const cafes = raw
    .filter(r => r['Tên quán']?.toString().trim())
    .map(r => {
      const parseImgs = (val) =>
        String(val || '').split('\n').map(s => s.trim()).filter(Boolean)

      return {
        name:        r['Tên quán']?.toString().trim(),
        address:     r['Địa chỉ']?.toString().trim(),
        district:    r['Quận/Huyện']?.toString().trim(),
        rating:      parseFloat(r['Đánh giá'])   || 0,
        ratingCount: parseInt(r['Lượt review'])   || 0,
        minPrice:    parseInt(r['Giá từ (VNĐ)'])  || 0,
        openTime:    String(r['Giờ mở']  || '').trim().slice(0, 5),
        closeTime:   String(r['Giờ đóng'] || '').trim().slice(0, 5),
        isOpen24h:   String(r['Mở 24h']).toLowerCase() === 'true',
        featured:    String(r['Nổi bật']).toLowerCase() === 'true',
        amenities:   String(r['Tiện ích'] || '').split(',').map(s => s.trim()).filter(Boolean),
        tags:        String(r['Tags']     || '').split(',').map(s => s.trim()).filter(Boolean),
        images:      parseImgs(r['🖼 Đường dẫn ảnh quán (tự động)']),
        drinks:      parseImgs(r['🥤 Đường dẫn ảnh drink (tự động)']),
        location:    { type: 'Point', coordinates: [105.8412, 21.0285] },
      }
    })

  console.log(`📋 Đọc được ${cafes.length} quán\n`)

  await mongoose.connect(process.env.MONGO_URI)
  console.log('✅ MongoDB connected\n')

  let created = 0, updated = 0, errors = 0

  for (const cafe of cafes) {
    try {
      const exists = await Cafe.findOne({ name: cafe.name })
      if (exists) {
        await Cafe.findByIdAndUpdate(exists._id, { $set: cafe })
        updated++
        console.log(`  🔄 ${cafe.name}: ${cafe.images.length} ảnh + ${cafe.drinks.length} drink`)
      } else {
        await Cafe.create(cafe)
        created++
        console.log(`  ➕ ${cafe.name}: ${cafe.images.length} ảnh + ${cafe.drinks.length} drink`)
      }
    } catch (err) {
      errors++
      console.error(`  ❌ ${cafe.name}: ${err.message}`)
    }
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Xong!
   ➕ Thêm mới : ${created} quán
   🔄 Cập nhật : ${updated} quán
   ❌ Lỗi      : ${errors} quán
━━━━━━━━━━━━━━━━━━━━━━━━━`)

  await mongoose.disconnect()
  process.exit(0)
}

run().catch(err => {
  console.error('❌ Lỗi:', err.message)
  process.exit(1)
})
