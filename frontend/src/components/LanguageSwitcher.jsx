import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import './LanguageSwitcher.css'

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  
  const languages = [
    { code: 'es', label: 'ES' },
    { code: 'en', label: 'EN' },
    { code: 'it', label: 'IT' }
  ]

  const currentLang = languages.find(lang => lang.code === language) || languages[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="language-switcher-container" ref={containerRef}>
      <button 
        className="language-switcher" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Switch language"
      >
        <span>{currentLang.label}</span>
        <span className="language-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <div className="language-dropdown">
          {languages.map(lang => (
            <button
              key={lang.code}
              className={`language-option ${language === lang.code ? 'active' : ''}`}
              onClick={() => {
                setLanguage(lang.code)
                setIsOpen(false)
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher

