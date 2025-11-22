import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../utils/translations'
import './Footer.css'

function Footer() {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <h2 className="footer-logo">Maquiz</h2>
            <p className="footer-tagline">{t('footer.tagline')}</p>
          </div>
          
          <div className="footer-links-section">
            <div className="footer-links-group">
              <h3 className="footer-links-title">{t('footer.quickLinks')}</h3>
              <ul className="footer-links">
                <li><Link to="/">{t('nav.home')}</Link></li>
                <li><Link to="/gallery">{t('nav.gallery')}</Link></li>
                <li><Link to="/products">{t('nav.products')}</Link></li>
                <li><Link to="/about">{t('nav.about')}</Link></li>
                <li><Link to="/contact">{t('nav.contact')}</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-group">
              <h3 className="footer-links-title">{t('footer.followUs')}</h3>
              <div className="social-links">
                <a 
                  href="https://www.facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link social-link-facebook"
                  aria-label="Facebook"
                >
                  <svg className="social-icon" viewBox="0 0 24 24" fill="white" stroke="white">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="white"></path>
                  </svg>
                  <span>Facebook</span>
                </a>
                <a 
                  href="https://www.instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link social-link-instagram"
                  aria-label="Instagram"
                >
                  <svg className="social-icon" viewBox="0 0 24 24" fill="white" stroke="white">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="white" strokeWidth="1.5"></rect>
                    <circle cx="12" cy="12" r="3.5" fill="none" stroke="white" strokeWidth="1.5"></circle>
                    <circle cx="12" cy="12" r="2" fill="white"></circle>
                    <circle cx="17.5" cy="6.5" r="1" fill="white"></circle>
                  </svg>
                  <span>Instagram</span>
                </a>
                <a 
                  href="https://laclavedesolmaquiz.blogspot.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link social-link-blog"
                  aria-label="Blog"
                >
                  <svg className="social-icon" viewBox="0 0 24 24" fill="white" stroke="white">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="white" strokeWidth="1.5"></path>
                    <polyline points="14 2 14 8 20 8" fill="none" stroke="white" strokeWidth="1.5"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13" stroke="white" strokeWidth="1.5"></line>
                    <line x1="16" y1="17" x2="8" y2="17" stroke="white" strokeWidth="1.5"></line>
                    <path d="M10 7L8 7L8 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"></path>
                    <path d="M10 11L8 11" stroke="white" strokeWidth="1.5" strokeLinecap="round"></path>
                  </svg>
                  <span>Blog</span>
                </a>
                <a 
                  href="https://mondialartacademia.com/user/maquiz/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link social-link-mondial"
                  aria-label="Mondial Art"
                >
                  <svg className="social-icon" viewBox="0 0 24 24" fill="white" stroke="white">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="white" strokeWidth="1.5"></circle>
                    <circle cx="12" cy="12" r="8" fill="none" stroke="white" strokeWidth="1.5"></circle>
                    <path d="M2 12h20M12 2v20" stroke="white" strokeWidth="1.5"></path>
                    <circle cx="12" cy="12" r="2" fill="white"></circle>
                  </svg>
                  <span>Mondial Art</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="footer-copyright">{t('footer.copyright')}</p>
          <Link to="/admin/login" className="admin-link">
            <svg className="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>{t('footer.adminLogin')}</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer

