# Railway Deployment Setup

This guide explains how to deploy to Railway with a public GitHub repository while keeping credentials secure.

## How It Works

The application uses **environment variables** for sensitive credentials, which Railway can set securely without committing them to git.

## Setup Steps

### 1. Public GitHub Repository

✅ Your repository can be **completely public** - no problem!

- `seeds.rb` is safe to commit (no credentials)
- `seeds_credentials.rb` is gitignored (stays local)
- Credentials are set via Railway's environment variables

### 2. Connect Railway to GitHub

1. Go to [Railway](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Railway will automatically detect it's a Rails app

### 3. Set Environment Variables in Railway

In your Railway project dashboard:

1. Go to **Variables** tab
2. Add these environment variables:

```
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=your-secure-password
```

**Important:** These are stored securely by Railway and never exposed in your code or git history.

### 4. Database Setup

Railway will automatically:
- Run `rails db:create` (if needed)
- Run `rails db:migrate` 
- Run `rails db:seed` (which will use the ADMIN_EMAIL and ADMIN_PASSWORD env vars)

### 5. Local Development

For local development, you can still use the `seeds_credentials.rb` file:

```bash
# Create the file (not in git)
cp backend/db/seeds_credentials.example.rb backend/db/seeds_credentials.rb

# Edit with your credentials
# Then run:
cd backend
bundle exec rails db:seed
```

## Security Benefits

✅ **Public Repository** - Safe to share on GitHub
✅ **No Credentials in Code** - Everything uses environment variables
✅ **Railway Security** - Credentials stored securely in Railway dashboard
✅ **Local Development** - Can use local file for convenience

## Environment Variables Reference

### Required for Railway:
- `ADMIN_EMAIL` - Admin user email
- `ADMIN_PASSWORD` - Admin user password

### Optional (if you have other secrets):
- `DATABASE_URL` - Railway sets this automatically
- `RAILS_MASTER_KEY` - For encrypted credentials (if using)
- Any other API keys or secrets

## Verification

After deployment, verify the admin user was created:

1. Go to your Railway app URL
2. Navigate to `/admin/login`
3. Login with your credentials
4. You should have access to the admin dashboard

## Troubleshooting

### Admin user not created?

Check Railway logs:
```bash
railway logs
```

Look for:
- "Using credentials from environment variables" ✅ Good
- "Warning: Admin credentials not found" ❌ Check env vars

### Seeds not running?

Railway should run seeds automatically. If not:
1. Check Railway deployment logs
2. Manually trigger: `railway run rails db:seed`

## Summary

- ✅ Public GitHub repo is safe
- ✅ Use Railway environment variables for credentials
- ✅ Local development can use `seeds_credentials.rb` file
- ✅ No secrets in your code or git history

