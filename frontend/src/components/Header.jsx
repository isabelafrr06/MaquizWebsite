import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../utils/translations'
import LanguageSwitcher from './LanguageSwitcher'
import './Header.css'

function Header() {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.nav-menu') && !event.target.closest('.hamburger')) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-container">
          <Link to="/" className="logo">
            <h1>Maquiz</h1>
          </Link>
          <button 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
            <ul className="nav-links">
              <li>
                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/gallery" className={location.pathname === '/gallery' ? 'active' : ''}>
                  {t('nav.gallery')}
                </Link>
              </li>
              <li>
                <Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>
                  {t('nav.products')}
                </Link>
              </li>
              <li>
                <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
            <div className="mobile-language-switcher">
              <LanguageSwitcher />
            </div>
          </div>
          <div className="desktop-language-switcher">
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header

