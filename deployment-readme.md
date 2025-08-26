# RealNews Deployment Guide for Render

## Render Konfiguratsiyasi

Loyiha ikkita alohida servis sifatida deploy qilinadi:

### 1. Backend Service (Web Service)
- **Service Name:** `realnews-backend`
- **Build Command:** `npm install && npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist`
- **Start Command:** `NODE_ENV=production node dist/index.js`
- **Health Check:** `/api/health`
- **Environment Variables:**
  - `NODE_ENV=production`
  - `DATABASE_URL` - PostgreSQL database connection string
  - `SESSION_SECRET` - Session encryption key
  - `GEMINI_API_KEY` - AI features (optional)
  - `TELEGRAM_BOT_TOKEN` - Telegram bot (optional)
  - `TELEGRAM_CHAT_ID` - Telegram channel (optional)

### 2. Frontend Service (Static Site)
- **Service Name:** `realnews-frontend`
- **Build Command:** `npm install && npx vite build`
- **Publish Directory:** `./dist/public`

## Routing Konfiguratsiyasi

Frontend service'da quyidagi rewrite qoidalari sozlanadi:

```
/api/* → https://realnews-backend.onrender.com/api/*
/admin/* → https://realnews-backend.onrender.com/admin/*
/* → /index.html
```

## Manual Deployment Steps

Agar render.yaml ishlamasa, qo'lda quyidagi amallarni bajaring:

1. **Backend Service yarating:**
   - Service type: Web Service
   - Connect to your repository
   - Build command: `npm install && npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist`
   - Start command: `NODE_ENV=production node dist/index.js`
   - Health check path: `/api/health`

2. **Frontend Service yarating:**
   - Service type: Static Site
   - Build command: `npm install && npx vite build`
   - Publish directory: `dist/public`

3. **Frontend'da Redirects/Rewrites sozlang:**
   - `/api/*` → `https://YOUR_BACKEND_URL/api/*` (Type: Rewrite)
   - `/admin/*` → `https://YOUR_BACKEND_URL/admin/*` (Type: Rewrite)

## Environment Variables

Backend servisiga quyidagi environment variable'larni qo'shing:

- `NODE_ENV=production`
- `DATABASE_URL=your_postgresql_connection_string`
- `SESSION_SECRET=random_secure_key_for_sessions`
- `GEMINI_API_KEY=your_gemini_api_key` (ixtiyoriy)
- `TELEGRAM_BOT_TOKEN=your_bot_token` (ixtiyoriy)
- `TELEGRAM_CHAT_ID=your_channel_id` (ixtiyoriy)

## Testing

Deploy bo'lgandan keyin quyidagilarni tekshiring:

1. Frontend: `https://your-frontend-url.onrender.com`
2. Backend health: `https://your-backend-url.onrender.com/api/health`
3. API: `https://your-frontend-url.onrender.com/api/articles`
4. Admin: `https://your-frontend-url.onrender.com/admin`

## Troubleshooting

Agar muammolar bo'lsa:
- Backend logs'ni tekshiring
- Database connection'ni tasdiqlang
- Environment variables to'g'ri o'rnatilganini tekshiring
- Rewrite rules ishlayotganini tekshiring

## Database Setup

PostgreSQL database'ni sozlash:
1. Render'da PostgreSQL service yarating
2. DATABASE_URL'ni backend service'ga qo'shing
3. Database tables avtomatik yaratiladi (migration'lar)