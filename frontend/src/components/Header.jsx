import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../utils/translations'
import LanguageSwitcher from './LanguageSwitcher'
import './Header.css'

function Header() {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const location = useLocation()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    setIsLoggedIn(!!token)
  }, [location.pathname]) // Re-check when route changes

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

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (token) {
        // Call logout endpoint if it exists
        try {
          await fetch('/api/v1/admin/logout', {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          })
        } catch (error) {
          // Ignore logout API errors, just clear local storage
          console.error('Logout API error:', error)
        }
      }
      localStorage.removeItem('adminToken')
      setIsLoggedIn(false)
      setIsMenuOpen(false)
      navigate('/')
      window.location.reload() // Refresh to update UI
    } catch (error) {
      console.error('Error logging out:', error)
      // Still clear local storage even if API call fails
      localStorage.removeItem('adminToken')
      setIsLoggedIn(false)
      navigate('/')
    }
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
              {isLoggedIn && (
                <>
                  <li>
                    <Link 
                      to="/admin/dashboard" 
                      className={location.pathname === '/admin/dashboard' ? 'active' : ''}
                    >
                      {t('admin.dashboard')}
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={handleLogout}
                      className="logout-btn"
                    >
                      {t('admin.logout')}
                    </button>
                  </li>
                </>
              )}
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

