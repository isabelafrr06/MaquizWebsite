import { useState, useEffect } from 'react'
import ProtectedImageNoWatermark from './ProtectedImageNoWatermark'
import './ImageCarousel.css'

function ImageCarousel({ artworks }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying || artworks.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % artworks.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, artworks.length])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? artworks.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % artworks.length)
  }

  const goToSlide = (index) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  if (artworks.length === 0) {
    return <div className="carousel-empty">No artworks to display</div>
  }

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        <button 
          className="carousel-button carousel-button-prev" 
          onClick={goToPrevious}
          aria-label="Previous image"
        >
          ‹
        </button>
        
        <div className="carousel-slide-container">
          {artworks.map((artwork, index) => (
            <div
              key={artwork.id || index}
              className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
            >
              <ProtectedImageNoWatermark
                src={artwork.image_url}
                alt={artwork.title || `Artwork ${index + 1}`}
                className="carousel-image"
              />
              <div className="carousel-overlay">
                <div className="carousel-info">
                  <h3 className="carousel-title">{artwork.title}</h3>
                  {artwork.description && (
                    <p className="carousel-description">{artwork.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          className="carousel-button carousel-button-next" 
          onClick={goToNext}
          aria-label="Next image"
        >
          ›
        </button>
      </div>
      
      <div className="carousel-indicators">
        {artworks.map((artwork, index) => (
          <button
            key={artwork.id || index}
            className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default ImageCarousel

