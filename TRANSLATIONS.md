# Multi-Language Translation System

This website supports multiple languages for artwork content using a flexible JSON-based translation system.

## How It Works

### Database Structure
- Artworks have a `translations` JSONB field that stores translations for all languages
- Format: `{ "es": { "title": "...", "description": "...", "category": "..." }, "en": { ... } }`
- The original `title`, `description`, and `category` fields serve as fallbacks

### Adding New Languages

#### 1. Update Frontend Language Context
Edit `frontend/src/contexts/LanguageContext.jsx`:
```javascript
// Add your language code (e.g., 'fr' for French)
const availableLanguages = ['es', 'en', 'fr']
```

#### 2. Update Admin Form
Edit `frontend/src/pages/AdminDashboard.jsx`:
```javascript
// Add to the availableLanguages array
const availableLanguages = ['es', 'en', 'fr'] // Add 'fr' here
```

#### 3. Add Translation Files
Create `frontend/src/translations/fr.js` (or your language code) with all UI translations.

#### 4. Update Language Switcher
Add the new language option to `frontend/src/components/LanguageSwitcher.jsx`

#### 5. That's It!
The backend automatically handles any language code you add. No database migrations needed!

## Admin Interface

When creating/editing artworks:
1. Use the language tabs (ES, EN, etc.) to enter translations
2. Spanish (ES) is required for title
3. Other languages are optional
4. The system automatically falls back to Spanish if a translation is missing

## API Usage

The API accepts a `locale` parameter:
- `/api/v1/artworks?locale=es` - Returns Spanish translations
- `/api/v1/artworks?locale=en` - Returns English translations
- `/api/v1/artworks?locale=fr` - Returns French translations (if added)

If a translation doesn't exist, it falls back to Spanish, then to the original field.

## Example: Adding French

1. Add 'fr' to `availableLanguages` in AdminDashboard.jsx
2. Create `frontend/src/translations/fr.js`
3. Add French option to LanguageSwitcher
4. Done! Admins can now enter French translations for artworks.

No backend changes needed - the JSON field handles everything!

