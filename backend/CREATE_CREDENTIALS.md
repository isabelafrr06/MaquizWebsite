# How to Create Rails Encrypted Credentials

## Step 1: Create the Credentials File

Run this command in your terminal (from the `backend` directory):

```bash
cd backend
EDITOR="nano" bundle exec rails credentials:edit
```

Or if you prefer vim:
```bash
EDITOR="vim" bundle exec rails credentials:edit
```

Or if you prefer VS Code:
```bash
EDITOR="code --wait" bundle exec rails credentials:edit
```

## Step 2: Add Your Admin Credentials

When the editor opens, add this content:

```yaml
admin:
  email: your-email@example.com
  password: your-secure-password
```

**Important:** Replace `your-email@example.com` and `your-secure-password` with your actual credentials.

## Step 3: Save and Close

- **Nano**: Press `Ctrl+X`, then `Y`, then `Enter`
- **Vim**: Press `Esc`, type `:wq`, then `Enter`
- **VS Code**: Save the file and close the window

## Step 4: Get Your Master Key

After saving, Rails will create `config/master.key`. View it:

```bash
cat backend/config/master.key
```

**Copy this key** - you'll need it for Railway!

## Step 5: Use in Railway

In Railway dashboard → Variables, add:

```
RAILS_MASTER_KEY=<paste-your-master-key-here>
```

---

## Alternative: Just Use Environment Variables

If you don't want to set up Rails credentials, you can skip this and just use environment variables in Railway:

```
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-secure-password
```

This is simpler and works just as well for Railway deployment!

