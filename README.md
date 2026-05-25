# CafeLoop – Khám phá cafe không giới hạn

Ứng dụng web gợi ý quán cafe · React.js + Node.js · Responsive (Mobile + Desktop)

---

## 🎨 Design System — Blue/Teal Palette

| Token      | Hex       | Dùng cho           |
|------------|-----------|---------------------|
| `--azure`  | `#1CA7EC` | Primary interactive |
| `--navy`   | `#1F2F98` | Headings / accent   |
| `--teal`   | `#4ADEDE` | Highlights / badges |
| `--violet` | `#787FF6` | Secondary accent    |
| `--sky`    | `#7BD5F5` | Light tones         |

Style: **Monotone + Glassmorphism** · Font: **Plus Jakarta Sans + Syne**

---

## 🗂 Cấu trúc thư mục

```
cafeloop/
├── client/                     ← React.js (Vercel)
│   └── src/
│       ├── components/
│       │   ├── cafe/CafeCard.jsx
│       │   ├── layout/{Header, Sidebar, BottomNav, AppLayout}.jsx
│       │   ├── search/{SearchBar, FilterPanel}.jsx
│       │   └── ui/Skeleton.jsx
│       ├── pages/
│       │   ├── HomePage.jsx    ← Real API, filter chips
│       │   ├── ResultsPage.jsx ← Filter, sort, pagination
│       │   ├── DetailPage.jsx  ← Images, reviews, map CTA
│       │   └── ProfilePage.jsx
│       ├── hooks/
│       │   ├── useCafes.js     ← Search + filter unified
│       │   ├── useReviews.js
│       │   ├── useMediaQuery.js
│       │   └── useDebounce.js
│       ├── services/api.js     ← Axios + all endpoints
│       └── context/AuthContext.jsx
│
├── server/                     ← Node.js + Express (Render)
│   ├── routes/
│   │   ├── cafes.js            ← Full filter + pagination + total count
│   │   ├── search.js           ← Full-text + geo sort
│   │   ├── favorites.js        ← Toggle + list (NEW)
│   │   ├── reviews.js
│   │   └── auth.js
│   ├── models/{Cafe, User}.js
│   ├── middleware/{cache, errorHandler}.js
│   ├── scripts/seed.js         ← 20 quán mẫu Hà Nội
│   └── server.js
│
└── .github/workflows/ci.yml
```

---

## ⚡ Chạy local

### 1. Clone & cài dependencies

```bash
# Frontend
cd client && npm install

# Backend
cd ../server && npm install
```

### 2. Tạo file .env

```bash
# server/.env
PORT=5000
MONGO_URI=mongodb+srv://Admin:Hiep2407@cluster0-hiep.600wm.mongodb.net/?appName=Cluster0-Hiep
CLIENT_URL=http://localhost:5173
NODE_ENV=development
JWT_SECRET=your_super_secret_key_here

# client/.env
VITE_API_URL=http://localhost:5000
```

### 3. Seed dữ liệu mẫu (lần đầu)

```bash
cd server && node scripts/seed.js
```

Output:
```
✅ MongoDB connected
🌱 Đã thêm 20 quán cafe mẫu
```

### 4. Chạy dev servers

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:5000
- Health:   http://localhost:5000/health

---

## 🚀 Deploy

| Service  | Platform | Trigger         |
|----------|----------|-----------------|
| Frontend | Vercel   | Push to `main`  |
| Backend  | Render   | Push to `main`  |

---

## 🔌 API Endpoints

| Method | Endpoint                  | Mô tả                            |
|--------|---------------------------|----------------------------------|
| GET    | `/api/cafes`              | Danh sách + filter + pagination  |
| GET    | `/api/cafes/:id`          | Chi tiết quán                    |
| GET    | `/api/search?q=...`       | Tìm kiếm full-text               |
| GET    | `/api/reviews/:cafeId`    | Đánh giá của quán                |
| POST   | `/api/reviews`            | Tạo đánh giá mới                 |
| GET    | `/api/favorites`          | Danh sách yêu thích (auth)       |
| POST   | `/api/favorites/:cafeId`  | Toggle yêu thích (auth)          |
| POST   | `/api/auth/register`      | Đăng ký                          |
| POST   | `/api/auth/login`         | Đăng nhập                        |
| POST   | `/api/auth/logout`        | Đăng xuất                        |
| GET    | `/api/auth/me`            | Thông tin user hiện tại          |

### Filter params cho `/api/cafes`:

| Param      | Giá trị                                | Mô tả                    |
|------------|----------------------------------------|--------------------------|
| `sort`     | `rating` \| `nearest` \| `price`       | Sắp xếp                  |
| `amenities`| `wifi,ac,outlet,parking,pet,outdoor`   | Tiện ích (comma-sep)     |
| `maxDist`  | `1000` \| `3000` \| `5000` (meters)   | Bán kính (cần lat/lng)   |
| `price`    | `0-50000` \| `50000-100000` \| `100000+` | Mức giá                |
| `lat`, `lng`| số thực                               | Tọa độ người dùng        |
| `featured` | `true`                                 | Chỉ quán nổi bật         |
| `limit`    | số (max 50)                            | Số lượng kết quả         |
| `page`     | số                                     | Trang                    |
# Cafe_Loop
