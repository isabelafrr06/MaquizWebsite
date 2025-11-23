# Deployment Guide: Railway (Backend) + Vercel (Frontend)

This guide will help you deploy the Maquiz website with:
- **Backend (Rails API)**: Railway
- **Frontend (React)**: Vercel

## Prerequisites

1. GitHub account with your repository pushed
2. Railway account ([railway.app](https://railway.app))
3. Vercel account ([vercel.com](https://vercel.com))

---

## Part 1: Deploy Backend to Railway

### Step 1: Connect Railway to GitHub

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Railway will auto-detect it's a Rails app

### Step 2: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically set the `DATABASE_URL` environment variable

### Step 3: Configure Environment Variables

Go to your Railway service → **Variables** tab and add:

#### Required Variables:

```
RAILS_ENV=production
RAILS_MASTER_KEY=your-master-key-here
```

To get your master key:
```bash
cat backend/config/master.key
```

#### Optional (if not using Rails credentials):

```
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-secure-password
```

#### CORS Configuration (after frontend is deployed):

```
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Step 4: Configure Build Settings

Railway should auto-detect, but verify:

1. **Root Directory**: `backend`
2. **Build Command**: (auto-detected, should run `bundle install`)
3. **Start Command**: `bundle exec puma -C config/puma.rb`

### Step 5: Deploy

1. Railway will automatically deploy when you push to GitHub
2. Wait for deployment to complete
3. Check logs to ensure migrations and seeds ran successfully

**Important**: If migrations don't run automatically:
- Check the **"Release"** phase logs in Railway dashboard
- If needed, run migrations manually: `railway run rails db:migrate`
- See `backend/RAILWAY_TROUBLESHOOTING.md` for detailed troubleshooting

### Step 6: Get Your Backend URL

1. In Railway, go to your service
2. Click **"Settings"** → **"Generate Domain"**
3. Copy the URL (e.g., `https://your-app-name.railway.app`)
4. **Save this URL** - you'll need it for Vercel configuration

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Connect Vercel to GitHub

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect it's a Vite/React app

### Step 2: Configure Project Settings

In the project configuration:

- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (should be auto-detected)
- **Output Directory**: `dist` (should be auto-detected)
- **Install Command**: `npm install` (should be auto-detected)

### Step 3: Update vercel.json

Before deploying, update `frontend/vercel.json`:

Replace `YOUR_RAILWAY_APP_NAME` with your actual Railway app name:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-actual-app-name.railway.app/api/$1"
    }
  ]
}
```

### Step 4: Configure Environment Variables (Optional)

If you want to use environment variables instead of rewrites:

1. In Vercel project settings → **Environment Variables**
2. Add:
   ```
   VITE_API_URL=https://your-railway-app.railway.app
   ```

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build to complete
3. Vercel will provide you with a URL (e.g., `https://your-app.vercel.app`)

### Step 6: Update Railway CORS

After getting your Vercel URL:

1. Go back to Railway → Your service → **Variables**
2. Add/Update:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
3. Redeploy the backend (Railway will auto-redeploy)

---

## Part 3: Final Configuration

### Update vercel.json with Actual URLs

1. Get your Railway backend URL
2. Get your Vercel frontend URL
3. Update `frontend/vercel.json` with the Railway URL
4. Update Railway `FRONTEND_URL` with the Vercel URL
5. Redeploy both services

### Verify Deployment

1. **Frontend**: Visit your Vercel URL
2. **Backend API**: Visit `https://your-railway-app.railway.app/api/v1/artworks`
3. **Admin Login**: Visit `https://your-vercel-app.vercel.app/admin/login`

---

## Troubleshooting

### Backend Issues

**Database not connecting?**
- Check Railway logs: `railway logs`
- Verify `DATABASE_URL` is set automatically
- Check if migrations ran: Look for "db:migrate" in logs

**Seeds not running?**
- Check Railway logs for seed output
- Manually run: `railway run rails db:seed`
- Verify credentials are set correctly

**CORS errors?**
- Verify `FRONTEND_URL` is set in Railway
- Check that the frontend URL matches exactly (including `https://`)
- Restart the Railway service

### Frontend Issues

**API calls failing?**
- Check browser console for errors
- Verify `vercel.json` has the correct Railway URL
- Check Network tab to see if requests are going to the right place
- Ensure Railway backend is running and accessible

**404 on API routes?**
- Verify the rewrite rule in `vercel.json` is correct
- Check that the Railway URL is accessible
- Test the Railway URL directly in browser

**Build failing?**
- Check Vercel build logs
- Verify all dependencies are in `package.json`
- Check for TypeScript/ESLint errors

---

## Environment Variables Summary

### Railway (Backend)

| Variable | Required | Description |
|---------|----------|-------------|
| `RAILS_ENV` | Yes | Set to `production` |
| `RAILS_MASTER_KEY` | Yes* | Master key for Rails credentials |
| `ADMIN_EMAIL` | No* | Admin email (if not using credentials) |
| `ADMIN_PASSWORD` | No* | Admin password (if not using credentials) |
| `FRONTEND_URL` | Recommended | Your Vercel frontend URL for CORS |
| `DATABASE_URL` | Auto | Automatically set by Railway |

*Use either `RAILS_MASTER_KEY` OR `ADMIN_EMAIL`/`ADMIN_PASSWORD`

### Vercel (Frontend)

| Variable | Required | Description |
|---------|----------|-------------|
| `VITE_API_URL` | Optional | Backend URL (if not using rewrites) |

---

## Quick Reference

### Railway Commands (CLI)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# View logs
railway logs

# Run commands
railway run rails db:migrate
railway run rails db:seed
```

### Vercel Commands (CLI)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## Security Checklist

- ✅ `RAILS_MASTER_KEY` is set in Railway (not in code)
- ✅ `ADMIN_EMAIL` and `ADMIN_PASSWORD` are in Railway (not in code)
- ✅ `config/master.key` is in `.gitignore`
- ✅ `seeds_credentials.rb` is in `.gitignore`
- ✅ CORS is configured to allow only your frontend URL
- ✅ Database credentials are managed by Railway
- ✅ All sensitive data is in environment variables

---

## Next Steps

1. Set up custom domains (optional)
2. Configure SSL certificates (automatic on both platforms)
3. Set up monitoring and alerts
4. Configure backups for database
5. Set up CI/CD for automatic deployments

---

## Support

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Rails Deployment: https://guides.rubyonrails.org/deployment.html

