/**
 * importExcel.js — CafeLoop
 *
 * Workflow:
 *   1. Đọc metadata từ Excel (tên, địa chỉ, rating, tiện ích, ...)
 *   2. Dùng cột "Folder ảnh" để TÌM thư mục tương ứng trên disk (fuzzy match)
 *   3. Tự scan disk → lấy danh sách ảnh thực tế (không phụ thuộc cột path trong Excel)
 *   4. Upsert vào MongoDB
 *
 * Chạy: node scripts/importExcel.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const mongoose = require('mongoose')
const XLSX     = require('xlsx')
const path     = require('path')
const fs       = require('fs')
const Cafe     = require('../models/Cafe')

// ── Paths ──────────────────────────────────────────────
const EXCEL_FILE = process.argv[2]
  || path.join(__dirname, '../../client/public/cafeloop-cafes-v2.xlsx')

const IMG_ROOT = path.join(__dirname, '../../client/public/img')

// ── Helpers ────────────────────────────────────────────

/**
 * Normalize string: lowercase, bỏ dấu, bỏ ký tự đặc biệt
 * "Xofa Cafe & Bistro" → "xofa cafe and bistro" → "xofacafeandbistro"
 */
function normalize(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]/g, '')
}

/**
 * Tìm folder trên disk khớp với folderHint từ Excel
 * Dùng fuzzy match theo normalize() → tránh lỗi & vs and, dấu cách, ...
 */
function findDiskFolder(folderHint, diskFolders) {
  const hint = normalize(folderHint)
  if (!hint) return null

  // 1. Exact normalize match
  let match = diskFolders.find(f => normalize(f) === hint)
  if (match) return match

  // 2. One contains the other
  match = diskFolders.find(f => normalize(f).includes(hint) || hint.includes(normalize(f)))
  if (match) return match

  return null
}

/**
 * Scan thư mục img/<folder>/ → trả về { images[], drinks[] }
 * images: 0.jpg, 1.jpg, ... (số thứ tự)
 * drinks: drink1.jpg, drink2.jpg, ...
 */
function scanImages(folder) {
  const dir = path.join(IMG_ROOT, folder)
  if (!fs.existsSync(dir)) return { images: [], drinks: [] }

  const files = fs.readdirSync(dir)
    .filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
    .sort((a, b) => {
      // Sort: số trước (0.jpg < 1.jpg), drink sau (drink1 < drink2)
      const aNum = parseInt(a) 
      const bNum = parseInt(b)
      if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum
      return a.localeCompare(b)
    })

  const images = files
    .filter(f => /^\d+\.(jpe?g|png|webp)$/i.test(f))
    .map(f => `/img/${folder}/${f}`)

  const drinks = files
    .filter(f => /^drink\d*\.(jpe?g|png|webp)$/i.test(f))
    .map(f => `/img/${folder}/${f}`)

  return { images, drinks }
}

// ── Main ───────────────────────────────────────────────
async function run() {
  console.log('\n📂 Đọc file:', EXCEL_FILE)

  // Đọc danh sách folder trên disk
  const diskFolders = fs.existsSync(IMG_ROOT)
    ? fs.readdirSync(IMG_ROOT).filter(f =>
        fs.statSync(path.join(IMG_ROOT, f)).isDirectory()
      )
    : []
  console.log(`🖼  Tìm thấy ${diskFolders.length} folder ảnh trên disk\n`)

  // Đọc Excel
  const wb = XLSX.readFile(EXCEL_FILE)
  const ws = wb.Sheets['Cafes']
  if (!ws) { console.error('❌ Không tìm thấy sheet "Cafes"'); process.exit(1) }

  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
  const headers = rows[0]

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
    lat:         findCol('Lat'),
    lng:         findCol('Lng'),
  }

  const cafes = rows.slice(1)
    .filter(r => r[COL.name]?.toString().trim())
    .map(r => {
      const name       = String(r[COL.name] || '').trim()
      const folderHint = String(r[COL.folder] || name).trim()

      // Tìm folder thực trên disk
      const diskFolder = findDiskFolder(folderHint, diskFolders)
        || findDiskFolder(name, diskFolders)

      // Scan ảnh từ disk (source of truth)
      const { images, drinks } = diskFolder
        ? scanImages(diskFolder)
        : { images: [], drinks: [] }

      if (!diskFolder) {
        console.warn(`  ⚠️  Không tìm thấy folder cho: "${name}" (hint: "${folderHint}")`)
      }

      // Tọa độ (nếu có cột lat/lng, dùng; không thì default Hà Nội)
      const lat = parseFloat(r[COL.lat]) || 21.0285
      const lng = parseFloat(r[COL.lng]) || 105.8412

      return {
        name,
        address:     String(r[COL.address]  || '').trim(),
        district:    String(r[COL.district]  || '').trim(),
        rating:      parseFloat(r[COL.rating])    || 0,
        ratingCount: parseInt(r[COL.ratingCount])  || 0,
        minPrice:    parseInt(r[COL.minPrice])     || 0,
        openTime:    String(r[COL.openTime]  || '').trim().slice(0, 5),
        closeTime:   String(r[COL.closeTime] || '').trim().slice(0, 5),
        isOpen24h:   String(r[COL.isOpen24h]).toLowerCase() === 'true',
        featured:    String(r[COL.featured]).toLowerCase()  === 'true',
        amenities:   String(r[COL.amenities] || '').split(',').map(s => s.trim()).filter(Boolean),
        tags:        String(r[COL.tags]      || '').split(',').map(s => s.trim()).filter(Boolean),
        images,
        drinks,
        location: { type: 'Point', coordinates: [lng, lat] },
        _diskFolder: diskFolder, // chỉ dùng để log
      }
    })

  console.log(`📋 Đọc được ${cafes.length} quán từ Excel\n`)

  await mongoose.connect(process.env.MONGO_URI)
  console.log('✅ MongoDB connected\n')

  let created = 0, updated = 0, errors = 0, noFolder = 0

  for (const cafe of cafes) {
    const { _diskFolder, ...data } = cafe
    try {
      const exists = await Cafe.findOne({ name: data.name })
      if (exists) {
        await Cafe.findByIdAndUpdate(exists._id, { $set: data })
        updated++
      } else {
        await Cafe.create(data)
        created++
      }

      if (_diskFolder) {
        console.log(`  ✅ ${data.name}: ${data.images.length} ảnh + ${data.drinks.length} drink  [📁 ${_diskFolder}]`)
      } else {
        noFolder++
        console.log(`  ⚠️  ${data.name}: 0 ảnh (không tìm thấy folder)`)
      }
    } catch (err) {
      errors++
      console.error(`  ❌ ${data.name}: ${err.message}`)
    }
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Xong!
   ➕ Thêm mới  : ${created} quán
   🔄 Cập nhật  : ${updated} quán
   ⚠️  Thiếu ảnh : ${noFolder} quán
   ❌ Lỗi       : ${errors} quán
━━━━━━━━━━━━━━━━━━━━━━━━━`)

  await mongoose.disconnect()
  process.exit(0)
}

run().catch(err => {
  console.error('❌ Fatal:', err.message)
  process.exit(1)
})