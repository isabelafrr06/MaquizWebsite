import { translations as en } from '../translations/en'
import { translations as es } from '../translations/es'
import { translations as it } from '../translations/it'

const translations = {
  en,
  es,
  it
}

// Cache for database texts
let dbTextsCache = null
let dbTextsCacheTime = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Fetch texts from database
const fetchDbTexts = async (locale = 'es') => {
  const now = Date.now()
  // Return cached data if still valid and same locale
  if (dbTextsCache && dbTextsCacheTime && dbTextsCache.locale === locale && (now - dbTextsCacheTime) < CACHE_DURATION) {
    return dbTextsCache.data
  }

  try {
    const response = await fetch(`/api/v1/texts?locale=${locale}`)
    if (response.ok) {
      const data = await response.json()
      dbTextsCache = { data, locale }
      dbTextsCacheTime = now
      return data
    }
  } catch (error) {
    console.error('Error fetching texts from database:', error)
  }
  
  return null
}

// Initialize database texts on load (non-blocking)
// We'll fetch texts when needed based on current language

export const getTranslation = (language, key) => {
  // Ensure we have a valid language
  if (!language || !translations[language]) {
    language = 'en' // Default fallback
  }
  
  // Try to get from database cache first, but only if cache is for current language
  if (dbTextsCache && dbTextsCache.data && Array.isArray(dbTextsCache.data) && dbTextsCache.locale === language) {
    // Database texts come as an array: [{ key: 'contact.title', content: '...' }, ...]
    // Find the text object with matching key
    try {
      const textItem = dbTextsCache.data.find(item => item && item.key === key)
      if (textItem && textItem.content) {
        return textItem.content
      }
    } catch (error) {
      console.error('Error accessing database cache:', error)
    }
  }
  
  // Fallback to static translations
  try {
    const keys = key.split('.')
    let value = translations[language]
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        value = undefined
        break
      }
    }
    
    return value || key
  } catch (error) {
    console.error('Error getting translation:', error)
    return key
  }
}

// Function to refresh database texts cache (can be called after updates)
export const refreshTextsCache = async (locale = 'es') => {
  dbTextsCache = null
  dbTextsCacheTime = null
  return await fetchDbTexts(locale)
}

