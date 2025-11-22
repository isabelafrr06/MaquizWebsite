import { useRef, useEffect } from 'react'
import './ProtectedImage.css'

function ProtectedImageNoWatermark({ src, alt, className = '' }) {
  const imgRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const img = imgRef.current
    const container = containerRef.current

    if (!img || !container) return

    // Prevent right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault()
      return false
    }

    // Prevent drag
    const handleDragStart = (e) => {
      e.preventDefault()
      return false
    }

    // Prevent image selection
    const handleSelectStart = (e) => {
      e.preventDefault()
      return false
    }

    // Prevent keyboard shortcuts (Ctrl+C, Ctrl+A, etc.)
    const handleKeyDown = (e) => {
      if (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'a' || e.key === 'A' || e.key === 's' || e.key === 'S')) {
        e.preventDefault()
        return false
      }
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))) {
        e.preventDefault()
        return false
      }
      // Prevent Print Screen (basic protection)
      if (e.key === 'PrintScreen') {
        e.preventDefault()
        return false
      }
    }

    // Add event listeners
    img.addEventListener('contextmenu', handleContextMenu)
    img.addEventListener('dragstart', handleDragStart)
    img.addEventListener('selectstart', handleSelectStart)
    container.addEventListener('contextmenu', handleContextMenu)
    container.addEventListener('dragstart', handleDragStart)
    document.addEventListener('keydown', handleKeyDown)

    // Set draggable attribute
    img.setAttribute('draggable', 'false')

    return () => {
      img.removeEventListener('contextmenu', handleContextMenu)
      img.removeEventListener('dragstart', handleDragStart)
      img.removeEventListener('selectstart', handleSelectStart)
      container.removeEventListener('contextmenu', handleContextMenu)
      container.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div ref={containerRef} className={`protected-image-container no-watermark ${className}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="protected-image"
        draggable="false"
        loading="lazy"
      />
    </div>
  )
}

export default ProtectedImageNoWatermark

