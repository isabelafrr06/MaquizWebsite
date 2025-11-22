# Rails Encrypted Credentials Setup

Rails provides a built-in encrypted credentials system that's the recommended way to store secrets.

## Setup Instructions

### 1. Initialize Rails Credentials (if not already done)

```bash
cd backend
bundle exec rails credentials:edit
```

This will:
- Create `config/credentials.yml.enc` (encrypted file - safe to commit)
- Create `config/master.key` (decryption key - **NEVER commit this**)

### 2. Add Admin Credentials

When the editor opens, add:

```yaml
admin:
  email: your-admin-email@example.com
  password: your-secure-password
```

Save and close. The file will be automatically encrypted.

### 3. Verify Setup

Check that credentials are accessible:

```bash
bundle exec rails credentials:show
```

You should see your admin credentials (they'll be visible in plain text for verification).

### 4. Usage in Code

The credentials are accessed via:

```ruby
Rails.application.credentials.admin[:email]
Rails.application.credentials.admin[:password]
```

The seeds file (`db/seeds.rb`) already uses this automatically.

## For Railway/Production

### Option 1: Use Rails Master Key (Recommended)

1. In Railway dashboard, add environment variable:
   ```
   RAILS_MASTER_KEY=your-master-key-content
   ```
   
2. Copy the master key from `backend/config/master.key` (the entire content)

3. Railway will use this to decrypt `credentials.yml.enc` automatically

### Option 2: Use Environment Variables

Railway can also use environment variables directly:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

The seeds file will automatically use these if Rails credentials aren't available.

## Security

✅ **`config/credentials.yml.enc`** - Safe to commit (encrypted)
❌ **`config/master.key`** - NEVER commit (in `.gitignore`)
✅ **Railway** - Set `RAILS_MASTER_KEY` as environment variable

## Priority Order

The seeds file checks credentials in this order:
1. Rails encrypted credentials (`Rails.application.credentials.admin`)
2. Environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`)
3. Local file (`db/seeds_credentials.rb`)

## Benefits

- ✅ Rails standard approach
- ✅ Encrypted credentials file can be committed
- ✅ Master key stays private
- ✅ Works seamlessly with Railway
- ✅ No plain text secrets in code

