# Deployment Guide

## Architecture

- **Frontend (Vercel)**: 8 static sites — 4 public websites + 4 admin dashboards
- **Backend (Render)**: 4 Node.js services — one per subject
- **Database (MongoDB Atlas)**: 4 databases — one per subject
- **Email (Resend)**: Shared account, per-subject sending domains
- **Media (Cloudinary)**: Shared account, per-subject folders
- **Analytics (Plausible)**: Privacy-first, cookie-less tracking

## Prerequisites

- MongoDB Atlas cluster (free tier works) — create 4 DBs: `mahama_ibrahim`, `mahama_john`, `mahama_sharaf`, `mahama_lordina`
- Cloudinary account
- Resend account + verified sending domains
- OpenAI API key (optional, for AI admin features)
- Google Cloud project + OAuth 2.0 credentials (optional, for calendar sync)
- Plausible analytics account (optional, for visitor tracking)

---

## Option A: Render Blueprint (Recommended)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy via Blueprint

1. In Render: **New → Blueprint → Connect this repo**
2. Render reads `render.yaml` and provisions **13 services**:
   - 4 backends (Node.js)
   - 4 public websites (static)
   - 4 admin dashboards (static)
3. For each service, fill the `sync: false` env vars in the Render dashboard:

#### Backend env vars (per subject)
| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `PUBLIC_BASE_URL` | Render URL once known (e.g. `https://ibrahim-backend.onrender.com`) |
| `ALLOWED_ORIGINS` | Comma-separated frontend URLs (website + admin + localhost for dev) |
| `RESEND_API_KEY` | From Resend dashboard |
| `RESEND_FROM` | Verified sending domain |
| `CONTACT_INBOX` | Where contact form submissions go |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard |
| `OPENAI_API_KEY` | Optional — for AI admin features |
| `ADMIN_BOOTSTRAP_EMAIL` | First admin user email |
| `ADMIN_BOOTSTRAP_PASSWORD` | First admin user password |
| `GOOGLE_CLIENT_ID` | Optional — for Google Calendar sync |
| `GOOGLE_CLIENT_SECRET` | Optional — for Google Calendar sync |
| `GOOGLE_REDIRECT_URI` | Must match Render URL + `/api/admin/booking/google-calendar/callback` |

#### Frontend env vars (per subject)
| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | The matching backend's Render URL |
| `VITE_PLAUSIBLE_DOMAIN` | Your Plausible domain (optional) |
| `VITE_PLAUSIBLE_API_HOST` | Plausible instance URL (default: `https://plausible.io`) |

### 3. Re-deploy

After filling env vars, trigger a manual deploy for all services.

### 4. Seed data

SSH into each backend service shell and run:

```bash
pnpm --filter @mahama/ibrahim-backend seed
pnpm --filter @mahama/john-backend seed
pnpm --filter @mahama/sharaf-backend seed
pnpm --filter @mahama/lordina-backend seed
```

The seed script is idempotent — it skips collections that already have data.

---

## Option B: Vercel (Frontend) + Render Docker (Backend)

### Frontend on Vercel

1. Import the repo into Vercel
2. For each app, set:
   - **Root Directory**: `apps/ibrahim-website` (etc.)
   - **Build Command**: `cd ../.. && corepack enable && pnpm install --frozen-lockfile && pnpm --filter @mahama/ibrahim-website build`
   - **Output Directory**: `dist`
   - **Install Command**: `echo skip`
3. Add env vars in Vercel dashboard:
   - `VITE_API_BASE_URL`
   - `VITE_SUBJECT`
   - `VITE_PLAUSIBLE_DOMAIN`
   - `VITE_PLAUSIBLE_API_HOST`
4. The `vercel.json` in each app handles SPA routing (`/* → /index.html`)

### Backend on Render (Docker)

1. Create a new **Web Service** in Render
2. Choose **Docker** runtime
3. Set:
   - **Root Directory**: `.`
   - **Dockerfile Path**: `apps/ibrahim-backend/Dockerfile`
4. Add all backend env vars listed above
5. Health check path: `/health`

---

## Option C: Docker Compose (Self-hosted)

```yaml
# docker-compose.yml (example for one subject)
version: "3.8"
services:
  ibrahim-backend:
    build:
      context: .
      dockerfile: apps/ibrahim-backend/Dockerfile
    ports:
      - "4001:10000"
    env_file:
      - apps/ibrahim-backend/.env
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:10000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

---

## Local Development

```bash
# Install dependencies
pnpm install

# Copy env files
cp apps/ibrahim-backend/env.example apps/ibrahim-backend/.env
# repeat for john-backend, sharaf-backend, lordina-backend

cp apps/ibrahim-website/.env.example apps/ibrahim-website/.env
# repeat for all 8 frontends

# Start all apps in parallel (Turbo)
pnpm dev
```

| Service | Local URL |
|---------|-----------|
| Ibrahim Backend | http://localhost:4001 |
| John Backend | http://localhost:4002 |
| Sharaf Backend | http://localhost:4003 |
| Lordina Backend | http://localhost:4004 |
| Ibrahim Website | http://localhost:5173 |
| John Website | http://localhost:5175 |
| Sharaf Website | http://localhost:5177 |
| Lordina Website | http://localhost:5179 |
| Ibrahim Admin | http://localhost:5174 |
| John Admin | http://localhost:5176 |
| Sharaf Admin | http://localhost:5178 |
| Lordina Admin | http://localhost:5180 |

---

## Production Checklist

- [ ] MongoDB Atlas IP allowlist includes Render/Vercel IPs (or use `0.0.0.0/0`)
- [ ] JWT_SECRET is at least 32 chars and unique per backend
- [ ] Admin bootstrap credentials are set for first login
- [ ] Resend domain is verified
- [ ] Cloudinary upload preset is configured
- [ ] `ALLOWED_ORIGINS` includes all production frontend URLs
- [ ] `PUBLIC_BASE_URL` matches the actual backend URL
- [ ] Plausible domain is configured (optional)
- [ ] Google OAuth redirect URI is exact match (optional)
- [ ] Health check endpoint (`/health`) returns 200
- [ ] Seed data has been run for all 4 subjects
- [ ] Booking calendar sync tested (optional)

---

## Troubleshooting

### "CORS origin not allowed"
Check `ALLOWED_ORIGINS` includes your frontend URL exactly (including `https://` and no trailing slash).

### "Module not found" on Render build
Ensure `pnpm install --frozen-lockfile` runs at the repo root, not inside the app directory. The `render.yaml` `rootDir: .` handles this.

### Health check fails
The `/health` endpoint pings MongoDB. If it fails, check `MONGO_URI` and Atlas network access.

### Images don't load on production
Check `CLOUDINARY_*` env vars. The `OptimizedImage` component auto-generates transforms for Cloudinary URLs.
