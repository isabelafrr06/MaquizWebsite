import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../utils/translations'
import ImageCarousel from '../components/ImageCarousel'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './Home.css'
import axios from 'axios'

function Home() {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const [artworks, setArtworks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await axios.get(`/api/v1/artworks?locale=${language}`)
        // Filter artworks that are in carousel, or show first 5 if none are marked
        const carouselArtworks = response.data.filter(a => a.in_carousel === true)
        setArtworks(carouselArtworks.length > 0 ? carouselArtworks : response.data.slice(0, 5))
      } catch (error) {
        console.error('Error fetching artworks:', error)
        // Fallback to sample data if API is not available
        setArtworks([
          {
            id: 1,
            title: "Ocean Dreams",
            image_url: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200",
            description: "A beautiful representation of ocean waves"
          },
          {
            id: 2,
            title: "Sunset Serenity",
            image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
            description: "Vibrant colors of a sunset"
          },
          {
            id: 3,
            title: "Mountain Vista",
            image_url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200",
            description: "Majestic mountain landscape"
          },
          {
            id: 4,
            title: "Abstract Flow",
            image_url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200",
            description: "Abstract art with flowing colors"
          },
          {
            id: 5,
            title: "Urban Life",
            image_url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200",
            description: "Cityscape at night"
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchArtworks()
  }, [language])

  return (
    <div className="home">
      <Header />
      <main className="home-main">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">{t('artist.name')}</h1>
            <p className="hero-quote">
              "{t('home.quote')}"
            </p>
            <p className="hero-artistic-name">{t('artist.artisticName')}</p>
          </div>
        </section>
        
        <section className="carousel-section">
          <h2 className="section-title">{t('home.featuredWorks')}</h2>
          {loading ? (
            <div className="loading">{t('home.loadingArtworks')}</div>
          ) : (
            <ImageCarousel artworks={artworks} />
          )}
        </section>

        <section className="about-section">
          <div className="about-content">
            <h2 className="section-title">{t('home.aboutTitle')}</h2>
            <p className="about-text">
              {t('home.aboutText')}
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

export default Home

