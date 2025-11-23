# Quick Start: Deploy to Railway + Vercel

## 🚀 Railway (Backend) - 5 Minutes

1. **Create Railway Project**
   - Go to [railway.app](https://railway.app)
   - New Project → Deploy from GitHub
   - Select your repository

2. **Add PostgreSQL Database**
   - In Railway project: "+ New" → Database → PostgreSQL
   - `DATABASE_URL` is set automatically

3. **Set Environment Variables**
   - Go to Variables tab
   - Add: `RAILS_ENV=production`
   - Add: `RAILS_MASTER_KEY=<your-key>` (get from `cat backend/config/master.key`)

4. **Configure Service**
   - Root Directory: `backend`
   - Railway auto-detects Rails

5. **Deploy**
   - Railway auto-deploys on push
   - Get your URL: Settings → Generate Domain

---

## 🎨 Vercel (Frontend) - 5 Minutes

1. **Create Vercel Project**
   - Go to [vercel.com](https://vercel.com)
   - Add New Project → Import GitHub repo

2. **Configure Project**
   - Root Directory: `frontend`
   - Framework: Vite (auto-detected)
   - Build Command: `npm run build` (auto)
   - Output Directory: `dist` (auto)

3. **Update vercel.json**
   - Replace `YOUR_RAILWAY_APP_NAME` with your Railway app name
   - Example: `https://maquiz-backend.railway.app`

4. **Deploy**
   - Click Deploy
   - Get your URL: `https://your-app.vercel.app`

5. **Update Railway CORS**
   - Railway → Variables → Add: `FRONTEND_URL=https://your-app.vercel.app`
   - Railway auto-redeploys

---

## ✅ Verify

- Frontend: Visit Vercel URL
- API: Visit `https://your-railway-app.railway.app/api/v1/artworks`
- Admin: Visit `https://your-vercel-app.vercel.app/admin/login`

---

## 📝 Important URLs to Save

- Railway Backend: `https://your-app.railway.app`
- Vercel Frontend: `https://your-app.vercel.app`

Use these to update:
1. `frontend/vercel.json` (Railway URL)
2. Railway `FRONTEND_URL` variable (Vercel URL)

---

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

