# RealNews - Yangiliklar Aggregatsiya Platformasi

## LOYIHA HAQIDA BATAFSIL MA'LUMOT

### Asosiy Maqsad va Vazifalar
RealNews - bu zamonaviy yangiliklar yig'ish va tarqatish platformasidir. U turli RSS manbalardan yangiliklar yig'ib, kategoriya bo'yicha tartiblab, foydalanuvchilarga tez va qulay formatda taqdim etadi.

### Texnik Arxitektura

#### Frontend (Mijoz tomoni)
- **Texnologiya**: React 18 + TypeScript + Vite
- **Yo'naltirish**: Wouter router
- **UI Komponentlar**: Shadcn/ui + Radix UI
- **Uslublar**: Tailwind CSS
- **State Management**: TanStack React Query
- **Til**: Asosan o'zbek tili (uz-UZ)
- **PWA**: Service Worker bilan to'liq PWA qo'llab-quvvatlash

#### Backend (Server tomoni)
- **Texnologiya**: Node.js + Express.js + TypeScript
- **Ma'lumotlar bazasi**: PostgreSQL (Neon Serverless)
- **ORM**: Drizzle ORM
- **Autentifikatsiya**: Passport.js + Local Strategy
- **Session**: Express-session + PostgreSQL store

#### Ma'lumotlar Strukturasi
- **Kategoriyalar**: O'zbekiston, Dunyo, Sport, Texnologiya, Iqtisodiyot, Madaniyat, Siyosat
- **Maqolalar**: To'liq kontent, metama'lumotlar, rasm, kategoriya
- **RSS Manbalar**: Daryo.uz, Sky News, Reuters, Yahoo Finance va boshqalar
- **Foydalanuvchilar**: Admin panel uchun autentifikatsiya tizimi

### Asosiy Funksiyalar

#### 1. Yangiliklar Yig'ish (RSS Aggregation)
- Turli manbalardan RSS orqali avtomatik yangiliklar olish
- Har 30 daqiqada yangiliklar yangilanishi
- Takroriy maqolalarni filterlash
- Kategoriya bo'yicha avtomatik ajratish

#### 2. Kontentni Ko'rsatish
- **Asosiy sahifa**: Eng so'nggi va muhim yangiliklar
- **Shoshilinch yangiliklar**: Breaking news sekciyasi
- **Mashhur maqolalar**: Trending articles
- **Tavsiya etilgan**: Featured articles
- **Kategoriya sahifalari**: Har bir kategoriya uchun alohida sahifa

#### 3. Qo'shimcha Funksiyalar
- **Hikoyalar (Stories)**: Instagram-style qisqa videolar/rasmlar
- **Qidiruv tizimi**: Maqolalar bo'yicha qidiruv
- **Push bildiriilar**: Yangi muhim yangiliklar haqida xabar berish
- **Havo ma'lumoti**: Real vaqt ob-havo ko'rsatkichlari
- **Dark/Light Mode**: Mavzu o'zgartirish imkoniyati

#### 4. Admin Panel
- **Foydalanuvchi**: Akramjon (username: Akramjon)
- **Maqola boshqaruvi**: Yangi maqolalar qo'shish, tahrirlash
- **RSS manbalarni boshqarish**: Yangi RSS feed qo'shish
- **Statistika**: Ko'rishlar soni, mashhurlik ko'rsatkichlari

#### 5. AI Integratsiya (Ixtiyoriy)
- **Gemini 1.5 Flash API**: Maqolalarni qayta yozish, xulosalar
- **Tarjima**: Chet el yangilik manbalarini o'zbek tiliga tarjima
- **Tahlil**: Maqola muhimligini baholash

#### 6. Ijtimoiy Tarmoq Integratsiyasi
- **Telegram Bot**: Kanallarga avtomatik post yuborish
- **Rasm olish**: Unsplash API orqali mos rasmlar
- **Share funksiyalari**: Ijtimoiy tarmoqlarda bo'lishish

### File Strukturasi

```
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/     # UI komponentlar
│   │   ├── pages/         # Sahifalar
│   │   ├── hooks/         # Custom hooklar
│   │   └── lib/          # Yordamchi kutubxonalar
├── server/                # Backend Express app
│   ├── routes/           # API yo'nalishlari
│   ├── services/         # Biznes logika
│   └── middleware/       # O'rta dasturlar
├── shared/               # Umumiy tiplar va sxemalar
└── public/              # Statik fayllar
```

### API Endpoints

#### Yangiliklar
- `GET /api/articles` - Barcha maqolalar
- `GET /api/articles/breaking` - Shoshilinch yangiliklar
- `GET /api/articles/trending` - Mashhur maqolalar
- `GET /api/articles/featured` - Tavsiya etiladigan
- `GET /api/articles/:id` - Bitta maqola

#### Kategoriyalar
- `GET /api/categories` - Barcha kategoriyalar
- `GET /api/categories/:slug/articles` - Kategoriya maqolalari

#### RSS va Ma'lumotlar
- `POST /api/rss/fetch` - RSS yangiliklar olish
- `GET /api/weather` - Havo ma'lumoti
- `POST /api/newsletter` - Email ro'yxatiga qo'shish

#### Admin
- `POST /api/auth/login` - Kirish
- `POST /api/auth/logout` - Chiqish
- `GET /api/admin/stats` - Statistika

### Ma'lumotlar Bazasi Sxemasi

#### Users (Foydalanuvchilar)
- id, username, email, password_hash, role, isActive

#### Categories (Kategoriyalar)
- id, name, slug, icon, color, displayOrder

#### Articles (Maqolalar)
- id, title, content, description, imageUrl, categoryId, publishedAt, views, isBreaking, isFeatured

#### RSS_Feeds (RSS Manbalar)
- id, name, url, categoryId, isActive, lastFetched

#### Stories (Hikoyalar)
- id, title, imageUrl, videoUrl, categoryId, duration

### Hozirgi Holat va Muammolar

#### Ishlaydigan Funksiyalar ✅
- Asosiy web-server (5000-port)
- Ma'lumotlar bazasi ulanishi
- Admin foydalanuvchi yaratilgan
- Frontend-backend aloqasi
- PWA funksiyalari
- Kategoriya va maqolalar ko'rsatish

#### API Kalitlari Kerak ⚠️
- `GEMINI_API_KEY` - AI funksiyalar uchun
- `TELEGRAM_BOT_TOKEN` - Telegram integratsiya
- `UNSPLASH_ACCESS_KEY` - Rasm olish uchun

#### RSS Muammolari 🔄
- Ba'zi RSS manbalar ishlamayapti (Reuters, Yahoo)
- DNS resolution muammolari
- 404/400 xato kodlari

### Keyingi Qadamlar

1. **RSS Manbalarni Tuzatish**: Ishlamaydigan RSS URL-larni yangilash
2. **API Kalitlarni Qo'shish**: Qo'shimcha funksiyalar uchun
3. **Deployment**: Production muhitga o'tkazish
4. **SEO Optimizatsiya**: Qidiruv tizimlariga moslash
5. **Performance**: Tezlik va optimizatsiya

### Foydalanish Bo'yicha Ko'rsatmalar

#### Development
```bash
npm run dev          # Development server
npm run build        # Production build
npm run db:push      # Ma'lumotlar bazasini yangilash
```

#### Admin Kirish
- URL: `/admin`
- Username: `Akramjon`
- Password: [Admin parol]

Bu loyiha to'liq zamonaviy yangiliklar platformasi bo'lib, o'zbek auditoriya uchun maxsus moslashtirilgan va barcha zamonaviy web texnologiyalardan foydalanadi.