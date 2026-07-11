# WeddingOS Deployment Guide

Deploy WeddingOS in three parts: **database**, **API**, and **frontend**.

## Recommended stack

| Part | Service | Why |
|------|---------|-----|
| Database | [Neon](https://neon.tech) or [Railway](https://railway.app) | Managed PostgreSQL |
| API | [Render](https://render.com) or Railway | Runs Node/Express |
| Frontend | [Vercel](https://vercel.com) or Netlify | Hosts Vite/React |

---

## 1. Database (PostgreSQL)

1. Create a PostgreSQL database on Neon or Railway.
2. Copy the connection string (`DATABASE_URL`).

---

## 2. API (server)

### Environment variables

Set these on Render/Railway:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=use-a-long-random-string-at-least-32-chars
CLIENT_URL=https://your-frontend-domain.com
NODE_ENV=production
PORT=5000

# Email (required for password reset emails in production)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM="WeddingOS <your-email@gmail.com>"
```

### Build & start commands

```bash
# Build command
cd server && npm install && npx prisma migrate deploy

# Start command
cd server && node index.js
```

### After deploy

- API URL example: `https://weddingos-api.onrender.com`
- Test: open `https://your-api-url/` — should return `{ "message": "WeddingOS API running" }`

---

## 3. Frontend (client)

### Environment variables

On Vercel/Netlify:

```env
VITE_API_URL=https://your-api-url.onrender.com
```

### Build settings

```bash
# Root directory
client

# Build command
npm install && npm run build

# Output directory
dist
```

---

## 4. Phone & computer access

Once deployed:

1. Open your frontend URL in Chrome on your computer.
2. On your phone, open the same URL and **Add to Home Screen** (iOS/Android) for an app-like shortcut.
3. Log in — no Git Bash needed.

---

## 5. Security checklist before going live

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `CLIENT_URL` to your real frontend URL only
- [ ] Configure SMTP for password reset emails
- [ ] Confirm HTTPS on both frontend and API
- [ ] Never commit `.env` files

---

## Local development

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

Forgot password locally: reset link prints in the **server terminal** if SMTP is not configured.
