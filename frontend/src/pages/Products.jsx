import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../utils/translations'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProtectedImage from '../components/ProtectedImage'
import axios from 'axios'
import './Products.css'

function Products() {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const [artworks, setArtworks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTheme, setSelectedTheme] = useState('all')
  const [showContactModal, setShowContactModal] = useState(false)

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await axios.get(`/api/v1/artworks?locale=${language}`)
        // Filter only artworks that are for sale
        const forSale = response.data.filter(artwork => artwork.for_sale === true)
        setArtworks(forSale)
      } catch (error) {
        console.error('Error fetching artworks:', error)
        setArtworks([])
      } finally {
        setLoading(false)
      }
    }

    fetchArtworks()
  }, [language])

  useEffect(() => {
    // Prevent body scroll when modal is open
    if (showContactModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Handle escape key to close modal
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showContactModal) {
        setShowContactModal(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleEscape)
    }
  }, [showContactModal])

  const categories = ['all', ...new Set(artworks.map(a => a.category).filter(Boolean))]
  const themes = ['all', ...new Set(artworks.map(a => a.theme).filter(Boolean))]
  
  const filteredArtworks = artworks.filter(artwork => {
    const categoryMatch = selectedCategory === 'all' || artwork.category === selectedCategory
    const themeMatch = selectedTheme === 'all' || artwork.theme === selectedTheme
    return categoryMatch && themeMatch
  })

  if (loading) {
    return (
      <div className="products-page">
        <Header />
        <div className="loading-container">
          <p>{t('products.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="products-page">
      <Header />
      <main className="products-main">
        <section className="products-hero">
          <h1 className="products-title">{t('products.title')}</h1>
          <p className="products-subtitle">{t('products.subtitle')}</p>
        </section>

        <section className="products-content">
          {artworks.length === 0 ? (
            <div className="no-products">
              <p>{t('products.noProducts')}</p>
            </div>
          ) : (
            <>
              <div className="products-filters">
                <div className="filter-group">
                  <h3 className="filter-group-title">{t('gallery.category')}</h3>
                  <div className="filter-buttons">
                    {categories.map(category => (
                      <button
                        key={category}
                        className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category === 'all' ? t('gallery.allCategories') : category}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="filter-group">
                  <h3 className="filter-group-title">{t('gallery.theme')}</h3>
                  <div className="filter-buttons">
                    {themes.map(theme => (
                      <button
                        key={theme}
                        className={`filter-btn ${selectedTheme === theme ? 'active' : ''}`}
                        onClick={() => setSelectedTheme(theme)}
                      >
                        {theme === 'all' ? t('gallery.allThemes') : theme}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {filteredArtworks.length === 0 ? (
                <div className="no-products">
                  <p>{t('products.noProductsInCategory')}</p>
                </div>
              ) : (
                <div className="products-grid">
                  {filteredArtworks.map(artwork => (
                  <div key={artwork.id} className="product-card">
                    <div className="product-image-container">
                      <ProtectedImage 
                        src={artwork.image_url} 
                        alt={artwork.title}
                        className="product-image"
                        watermarkText="Maquiz"
                      />
                      <div className="sale-badge">{t('products.forSale')}</div>
                    </div>
                    <div className="product-info">
                      <h3 className="product-title">{artwork.title}</h3>
                      <div className="product-tags">
                        {artwork.category && (
                          <span className="product-category">{artwork.category}</span>
                        )}
                        {artwork.theme && (
                          <span className="product-theme">{artwork.theme}</span>
                        )}
                        {artwork.year && (
                          <span className="product-year">{artwork.year}</span>
                        )}
                      </div>
                      {artwork.description && (
                        <p className="product-description">{artwork.description}</p>
                      )}
                      <div className="product-price-section">
                        <span className="price-label">{t('products.price')}:</span>
                        <span className="product-price">
                          ${artwork.price ? artwork.price.toLocaleString() : 'N/A'}
                        </span>
                      </div>
                      <button 
                        className="inquiry-btn"
                        onClick={() => setShowContactModal(true)}
                      >
                        {t('products.inquire')}
                      </button>
                    </div>
                  </div>
                  ))}
                </div>
              )}
              
              <div className="products-note">
                <p>{t('products.note')}</p>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />

      {showContactModal && (
        <div className="contact-modal-overlay" onClick={() => setShowContactModal(false)}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            <div className="contact-modal-header">
              <h2>{t('contact.title')}</h2>
              <button 
                className="contact-modal-close"
                onClick={() => setShowContactModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="contact-modal-content">
              <div className="contact-options">
                <div className="contact-option-card whatsapp-card">
                  <div className="card-icon-wrapper whatsapp-icon-wrapper">
                    <svg className="contact-option-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="card-content">
                    <h3>{t('contact.whatsapp')}</h3>
                    <p>{t('contact.whatsappDescription')}</p>
                    <p className="contact-number">+506 8356 4418</p>
                  </div>
                  <a 
                    href={`https://wa.me/50683564418`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="contact-option-btn whatsapp-btn"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor"/>
                    </svg>
                    {t('contact.whatsappButton')}
                  </a>
                </div>
                
                <div className="contact-option-card email-card">
                  <div className="card-icon-wrapper email-icon-wrapper">
                    <svg className="contact-option-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="card-content">
                    <h3>{t('contact.email')}</h3>
                    <p>{t('contact.emailDescription')}</p>
                    <p className="contact-email">{t('artist.email')}</p>
                  </div>
                  <a 
                    href={`mailto:${t('artist.email')}?subject=${encodeURIComponent(t('contact.emailSubject'))}`} 
                    className="contact-option-btn email-btn"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
                    </svg>
                    {t('contact.emailButton')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products

