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

  useEffect(() => {
    // Save language preference to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('language', language)
        // Fetch texts for the new language in the background
        refreshTextsCache(language).catch((err) => {
          console.error('Error refreshing texts cache:', err)
        })
      } catch (error) {
        console.error('Error in language effect:', error)
      }
    }
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en')
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

