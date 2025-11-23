import { createContext, useContext, useState, useEffect } from 'react'
import { refreshTextsCache } from '../utils/translations'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get language from localStorage or default to English
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'en'
    }
    return 'en'
  })
  const [textsLoaded, setTextsLoaded] = useState(false)

  // Initial fetch of texts on mount - this is critical for database texts to work
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initialLanguage = localStorage.getItem('language') || 'en'
      // Fetch texts for the initial language immediately
      refreshTextsCache(initialLanguage)
        .then((data) => {
          if (data && typeof data === 'object' && Object.keys(data).length > 0) {
            console.log('✅ Database texts loaded successfully for', initialLanguage)
            console.log('Sample keys in cache:', Object.keys(data).slice(0, 10))
            console.log('Example: home.heroTitle =', data.home?.heroTitle || 'NOT FOUND')
            setTextsLoaded(true)
            // Force a re-render by updating state so components use database texts
          } else {
            console.warn('⚠️ No database texts found or empty response, using static translations')
            console.log('Response was:', data)
            setTextsLoaded(true)
          }
        })
        .catch((err) => {
          console.error('❌ Error fetching initial texts cache:', err)
          setTextsLoaded(true)
        })
    }
  }, [])

  useEffect(() => {
    // Save language preference to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('language', language)
        // Fetch texts for the new language and force re-render when done
        refreshTextsCache(language)
          .then((data) => {
            if (data) {
              console.log('Database texts loaded for', language)
              // Force a re-render by updating a state that components can use
              setTextsLoaded(true)
            }
          })
          .catch((err) => {
            console.error('Error refreshing texts cache:', err)
            setTextsLoaded(true) // Still set to true so components render
          })
      } catch (error) {
        console.error('Error in language effect:', error)
        setTextsLoaded(true)
      }
    }
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en')
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, textsLoaded }}>
      {children}
    </LanguageContext.Provider>
  )
}

