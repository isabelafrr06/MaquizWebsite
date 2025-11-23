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
    // Get language from localStorage or default to Spanish
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'es'
    }
    return 'es'
  })
  const [textsLoaded, setTextsLoaded] = useState(false)

  // Initial fetch of texts on mount - this is critical for database texts to work
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initialLanguage = localStorage.getItem('language') || 'es'
      // Fetch texts for the initial language immediately
      refreshTextsCache(initialLanguage)
        .then((data) => {
          if (data && typeof data === 'object' && Object.keys(data).length > 0) {
            setTextsLoaded(true)
            // Force a re-render by updating state so components use database texts
          } else {
            setTextsLoaded(true)
          }
        })
        .catch((err) => {
          console.error('Error fetching initial texts cache:', err)
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

