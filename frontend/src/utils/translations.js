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
let dbAllKeysCache = null // Track all keys that exist in database (even if hidden)
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Listeners for cache updates (to trigger re-renders)
let cacheUpdateListeners = []

// Subscribe to cache updates
export const onCacheUpdate = (callback) => {
  cacheUpdateListeners.push(callback)
  return () => {
    cacheUpdateListeners = cacheUpdateListeners.filter(cb => cb !== callback)
  }
}

// Notify all listeners that cache was updated
const notifyCacheUpdate = () => {
  cacheUpdateListeners.forEach(callback => {
    try {
      callback()
    } catch (error) {
      console.error('Error in cache update listener:', error)
    }
  })
}

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
      const responseData = await response.json()
      
      // Handle new format with _meta, or old format for backward compatibility
      let data, allKeys
      if (responseData.texts && responseData._meta) {
        // New format with metadata
        data = responseData.texts
        allKeys = responseData._meta.all_keys || {}
      } else {
        // Old format (backward compatibility)
        data = responseData
        allKeys = {}
      }
      
      if (data && typeof data === 'object' && Object.keys(data).length >= 0) {
        dbTextsCache = { data, locale }
        dbAllKeysCache = allKeys // Store all keys that exist in DB
        dbTextsCacheTime = now
        notifyCacheUpdate() // Notify listeners that cache was updated
        return data
      }
    }
  } catch (error) {
    // Silently handle errors
  }
  
  return null
}

// Initialize database texts on load (non-blocking)
// We'll fetch texts when needed based on current language

// Helper function to check if a key exists in the all_keys structure
const keyExistsInDb = (key) => {
  if (!dbAllKeysCache || typeof dbAllKeysCache !== 'object') {
    return false
  }
  
  try {
    const keys = key.split('.')
    let current = dbAllKeysCache
    
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k]
      } else {
        return false
      }
    }
    
    // If we got here, the key path exists
    return current === true || (typeof current === 'object' && Object.keys(current).length > 0)
  } catch (error) {
    return false
  }
}

export const getTranslation = (language, key) => {
  // Ensure we have a valid language
  if (!language || !translations[language]) {
    language = 'en' // Default fallback
  }
  
  // Check if this key exists in the database (even if hidden)
  const keyExistsInDatabase = keyExistsInDb(key)
  
  // Try to get from database cache first - prioritize database over static
  if (dbTextsCache && dbTextsCache.data && typeof dbTextsCache.data === 'object' && !Array.isArray(dbTextsCache.data)) {
    // Use cache if locale matches, or if no locale is set (default to es)
    // Also try to use cache for other languages if available (fallback)
    const cacheLocale = dbTextsCache.locale || 'es'
    const useCache = cacheLocale === language || (cacheLocale === 'es' && language === 'en') || (cacheLocale === 'es' && language === 'it')
    
    if (useCache) {
      // Database texts come as a nested object: { home: { quote: "..." }, contact: { title: "..." } }
      // Navigate through the nested structure using the key path
      try {
        const keys = key.split('.')
        let value = dbTextsCache.data
        
        for (const k of keys) {
          if (value && typeof value === 'object' && k in value) {
            value = value[k]
          } else {
            value = undefined
            break
          }
        }
        
        if (value !== undefined) {
          // Key exists in database cache
          if (value && typeof value === 'string' && value.trim() !== '') {
            // Database text found and is not empty - use it (PRIORITY)
            return value
          } else {
            // Key exists in database but value is empty/null - return empty string
            // Don't fall back to static if key exists in DB (even if hidden/empty)
            return value || ''
          }
        } else if (keyExistsInDatabase) {
          // Key exists in database but is hidden (not in texts object) - return empty, don't use static
          return ''
        }
      } catch (error) {
        // Silently handle errors
      }
    }
  } else if (keyExistsInDatabase) {
    // Key exists in database but cache not loaded yet - return empty to avoid showing static
    return ''
  }
  
  // Fallback to static translations ONLY if key does NOT exist in database
  if (!keyExistsInDatabase) {
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
      return key
    }
  }
  
  // Key exists in database but not found in cache - return empty
  return ''
}

// Function to refresh database texts cache (can be called after updates)
export const refreshTextsCache = async (locale = 'es') => {
  dbTextsCache = null
  dbTextsCacheTime = null
  dbAllKeysCache = null
  const data = await fetchDbTexts(locale)
  if (data) {
    notifyCacheUpdate() // Notify listeners that cache was updated
  }
  return data
}

// Export function to check if database texts are being used
export const isUsingDatabaseTexts = (language) => {
  return dbTextsCache && 
         dbTextsCache.data && 
         typeof dbTextsCache.data === 'object' && 
         !Array.isArray(dbTextsCache.data) && 
         dbTextsCache.locale === language
}

