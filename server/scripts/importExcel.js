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

  // Dùng sheet_to_json với header:1 để lấy theo index, tránh lỗi emoji trên Windows
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
  
  // Row 0 = headers, rows 1+ = data
  const headers = rows[0]
  console.log('Headers count:', headers.length)

  // Tìm index cột theo keyword (không dùng emoji)
  function findCol(keyword) {
    return headers.findIndex(h => String(h || '').includes(keyword))
  }

  const COL = {
    name:        findCol('Tên quán'),
    address:     findCol('Địa chỉ'),
    district:    findCol('Quận'),
    rating:      findCol('Đánh giá'),
    ratingCount: findCol('Lượt review'),
    minPrice:    findCol('Giá từ'),
    openTime:    findCol('Giờ mở'),
    closeTime:   findCol('Giờ đóng'),
    isOpen24h:   findCol('Mở 24h'),
    featured:    findCol('Nổi bật'),
    amenities:   findCol('Tiện ích'),
    tags:        findCol('Tags'),
    folder:      findCol('Folder'),
    imgCount:    findCol('Số ảnh quán'),
    drinkCount:  findCol('Số ảnh drink'),
    images:      findCol('Đường dẫn ảnh quán'),
    drinks:      findCol('Đường dẫn ảnh drink'),
  }

  console.log('Column mapping:')
  Object.entries(COL).forEach(([k,v]) => console.log(`  ${k}: col ${v} (${headers[v] || 'NOT FOUND'})`))

  const parseImgs = (val) =>
    String(val || '').split('\n').map(s => s.trim()).filter(Boolean)

  const cafes = rows.slice(1)
    .filter(r => r[COL.name]?.toString().trim())
    .map(r => ({
      name:        String(r[COL.name]  || '').trim(),
      address:     String(r[COL.address] || '').trim(),
      district:    String(r[COL.district] || '').trim(),
      rating:      parseFloat(r[COL.rating])   || 0,
      ratingCount: parseInt(r[COL.ratingCount]) || 0,
      minPrice:    parseInt(r[COL.minPrice])    || 0,
      openTime:    String(r[COL.openTime]  || '').trim().slice(0, 5),
      closeTime:   String(r[COL.closeTime] || '').trim().slice(0, 5),
      isOpen24h:   String(r[COL.isOpen24h]).toLowerCase() === 'true',
      featured:    String(r[COL.featured]).toLowerCase()  === 'true',
      amenities:   String(r[COL.amenities] || '').split(',').map(s => s.trim()).filter(Boolean),
      tags:        String(r[COL.tags]      || '').split(',').map(s => s.trim()).filter(Boolean),
      images:      parseImgs(r[COL.images]),
      drinks:      parseImgs(r[COL.drinks]),
      location:    { type: 'Point', coordinates: [105.8412, 21.0285] },
    }))

  console.log(`\n📋 Đọc được ${cafes.length} quán\n`)

  await mongoose.connect(process.env.MONGO_URI)
  console.log('✅ MongoDB connected\n')

  let created = 0, updated = 0, errors = 0

  for (const cafe of cafes) {
    try {
      const exists = await Cafe.findOne({ name: cafe.name })
      if (exists) {
        await Cafe.findByIdAndUpdate(exists._id, { $set: cafe })
        updated++
      } else {
        await Cafe.create(cafe)
        created++
      }
      console.log(`  ✅ ${cafe.name}: ${cafe.images.length} ảnh + ${cafe.drinks.length} drink`)
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
