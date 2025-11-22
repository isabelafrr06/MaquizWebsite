# Railway Deployment Setup

This guide explains how to deploy to Railway with a public GitHub repository while keeping credentials secure.

## How It Works

The application supports multiple methods for credentials (in priority order):
1. **Rails encrypted credentials** (Recommended) - Uses `RAILS_MASTER_KEY` environment variable
2. **Environment variables** - `ADMIN_EMAIL` and `ADMIN_PASSWORD`
3. **Local credentials file** - For local development only

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

### 3. Set Credentials in Railway

You have two options:

#### Option A: Rails Encrypted Credentials (Recommended)

1. In Railway dashboard, go to **Variables** tab
2. Add this environment variable:

```
RAILS_MASTER_KEY=your-master-key-content
```

To get your master key:
```bash
cat backend/config/master.key
```

Copy the entire content and paste it as the value.

The encrypted credentials file (`config/credentials.yml.enc`) is already in your repo, and Railway will use the master key to decrypt it.

#### Option B: Environment Variables

1. In Railway dashboard, go to **Variables** tab
2. Add these environment variables:

```
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=your-secure-password
```

**Important:** All credentials are stored securely by Railway and never exposed in your code or git history.

### 4. Database Setup

Railway will automatically:
- Run `rails db:create` (if needed)
- Run `rails db:migrate` 
- Run `rails db:seed` (which will automatically use Rails credentials or environment variables)

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

### Option 1: Rails Credentials (Recommended)
- `RAILS_MASTER_KEY` - Master key to decrypt `config/credentials.yml.enc`

### Option 2: Direct Environment Variables
- `ADMIN_EMAIL` - Admin user email
- `ADMIN_PASSWORD` - Admin user password

### Automatic (Railway sets these):
- `DATABASE_URL` - Database connection string
- `RAILS_ENV` - Environment (production)

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
- "Using credentials from Rails encrypted credentials" ✅ Best (using master key)
- "Using credentials from environment variables" ✅ Good (using env vars)
- "Warning: Admin credentials not found" ❌ Check credentials setup

### Seeds not running?

Railway should run seeds automatically. If not:
1. Check Railway deployment logs
2. Manually trigger: `railway run rails db:seed`

## Summary

- ✅ Public GitHub repo is safe
- ✅ Recommended: Use Rails encrypted credentials with `RAILS_MASTER_KEY`
- ✅ Alternative: Use `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables
- ✅ Local development can use Rails credentials or `seeds_credentials.rb` file
- ✅ No secrets in your code or git history
- ✅ `config/credentials.yml.enc` is safe to commit (encrypted)
- ✅ `config/master.key` is gitignored (never commit)

