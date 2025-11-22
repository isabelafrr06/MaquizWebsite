import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../utils/translations'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProtectedImage from '../components/ProtectedImage'
import axios from 'axios'
import './Gallery.css'

function Gallery() {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const [artworks, setArtworks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTheme, setSelectedTheme] = useState('all')

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await axios.get(`/api/v1/artworks?locale=${language}`)
        setArtworks(response.data)
      } catch (error) {
        console.error('Error fetching artworks:', error)
        setArtworks([])
      } finally {
        setLoading(false)
      }
    }

    fetchArtworks()
  }, [language])

  const categories = ['all', ...new Set(artworks.map(a => a.category).filter(Boolean))]
  const themes = ['all', ...new Set(artworks.map(a => a.theme).filter(Boolean))]
  
  const filteredArtworks = artworks.filter(artwork => {
    const categoryMatch = selectedCategory === 'all' || artwork.category === selectedCategory
    const themeMatch = selectedTheme === 'all' || artwork.theme === selectedTheme
    return categoryMatch && themeMatch
  })

  if (loading) {
    return (
      <div className="gallery-page">
        <Header />
        <div className="loading-container">
          <p>{t('gallery.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="gallery-page">
      <Header />
      <main className="gallery-main">
        <section className="gallery-hero">
          <h1 className="gallery-title">{t('gallery.title')}</h1>
          <p className="gallery-subtitle">{t('gallery.subtitle')}</p>
        </section>

        <section className="gallery-content">
          <div className="gallery-filters">
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

          <div className="artworks-grid">
            {filteredArtworks.length === 0 ? (
              <p className="no-artworks">{t('gallery.noArtworks')}</p>
            ) : (
              filteredArtworks.map(artwork => (
                <div key={artwork.id} className="artwork-card">
                  <div className="artwork-image-container">
                    <ProtectedImage 
                      src={artwork.image_url} 
                      alt={artwork.title}
                      className="artwork-image"
                      watermarkText="Maquiz"
                    />
                    {artwork.for_sale && (
                      <div className="for-sale-badge">{t('gallery.forSale')}</div>
                    )}
                  </div>
                  <div className="artwork-info">
                    <h3 className="artwork-title">{artwork.title}</h3>
                    <div className="artwork-tags">
                      {artwork.category && (
                        <span className="artwork-category">{artwork.category}</span>
                      )}
                      {artwork.theme && (
                        <span className="artwork-theme">{artwork.theme}</span>
                      )}
                      {artwork.year && (
                        <span className="artwork-year">{artwork.year}</span>
                      )}
                    </div>
                    {artwork.description && (
                      <p className="artwork-description">{artwork.description}</p>
                    )}
                    {artwork.for_sale && artwork.price && (
                      <div className="artwork-price">
                        ${artwork.price.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Gallery

