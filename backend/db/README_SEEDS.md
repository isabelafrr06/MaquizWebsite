# Database Seeds Setup

This directory contains database seed files for populating the database with initial data.

## Files

- **`seeds.rb`** - Main seed file (PUBLIC - safe to commit)
  - Contains all seed data (categories, artworks, events, translations)
  - Does NOT contain sensitive credentials
  - Loads credentials from environment variables (Railway/production) OR `seeds_credentials.rb` (local development)

- **`seeds_credentials.rb`** - Admin credentials (PRIVATE - NOT in git)
  - Contains admin email and password
  - Excluded from git via `.gitignore`
  - You must create this file locally

- **`seeds_credentials.example.rb`** - Example template (PUBLIC - safe to commit)
  - Template showing the structure needed
  - Can be committed as a reference

## Setup Instructions

### For Local Development

1. Create your credentials file:

```bash
cp backend/db/seeds_credentials.example.rb backend/db/seeds_credentials.rb
```

2. Edit `seeds_credentials.rb` with your actual admin credentials:

```ruby
ADMIN_CREDENTIALS = {
  email: 'your-admin-email@example.com',
  password: 'your-secure-password',
  password_confirmation: 'your-secure-password'
}
```

### For Railway/Production

Set environment variables in Railway dashboard:
- `ADMIN_EMAIL` - Your admin email
- `ADMIN_PASSWORD` - Your admin password

The seeds file will automatically use these environment variables when available.

### 2. Verify Git Ignore

The `.gitignore` file should already exclude `seeds_credentials.rb`. Verify it's working:

```bash
git status
```

You should NOT see `backend/db/seeds_credentials.rb` in the list of files to commit.

### 3. If the File Was Already Committed

If `seeds_credentials.rb` was previously committed to git, remove it from tracking (but keep it locally):

```bash
git rm --cached backend/db/seeds_credentials.rb
git commit -m "Remove seeds_credentials.rb from git tracking"
```

This removes it from git history going forward, but keeps your local file intact.

### 4. Run Seeds

```bash
cd backend
bundle exec rails db:seed
```

The seed file will automatically load credentials from `seeds_credentials.rb` if it exists.

## Security Notes

- ✅ `seeds.rb` is safe to commit (no credentials)
- ✅ `seeds_credentials.example.rb` is safe to commit (just a template)
- ❌ `seeds_credentials.rb` should NEVER be committed (contains real credentials)
- The `.gitignore` file excludes `seeds_credentials.rb` automatically

## What Gets Committed

- ✅ `seeds.rb` - All seed data except credentials
- ✅ `seeds_credentials.example.rb` - Template for others
- ❌ `seeds_credentials.rb` - Your actual credentials (stays local)

