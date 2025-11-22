import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation, refreshTextsCache } from '../utils/translations'
import axios from 'axios'
import './AdminDashboard.css'

function AdminDashboard() {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const navigate = useNavigate()
  const [artworks, setArtworks] = useState([])
  const [events, setEvents] = useState([])
  const [texts, setTexts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('artworks')
  const [editingArtwork, setEditingArtwork] = useState(null)
  const [editingEvent, setEditingEvent] = useState(null)
  const [editingText, setEditingText] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)
  const [showTextForm, setShowTextForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showBreadcrumb, setShowBreadcrumb] = useState(false)
  const [showBreadcrumbMenu, setShowBreadcrumbMenu] = useState(false)
  const headerRef = useRef(null)
  const tabsRef = useRef(null)
  const breadcrumbMenuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth <= 768) {
        const headerBottom = headerRef.current?.getBoundingClientRect().bottom || 0
        const tabsBottom = tabsRef.current?.getBoundingClientRect().bottom || 0
        const threshold = 100 // Show breadcrumb when header/tabs are 100px above viewport
        setShowBreadcrumb(headerBottom < -threshold || tabsBottom < -threshold)
      } else {
        setShowBreadcrumb(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)
    handleScroll() // Check on mount

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (breadcrumbMenuRef.current && !breadcrumbMenuRef.current.contains(event.target)) {
        setShowBreadcrumbMenu(false)
      }
    }

    if (showBreadcrumbMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showBreadcrumbMenu])

  const fetchArtworks = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.get('/api/v1/admin/artworks', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setArtworks(response.data)
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
      }
      console.error('Error fetching artworks:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.get('/api/v1/admin/events', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setEvents(response.data)
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
      }
      console.error('Error fetching events:', error)
    }
  }

  const fetchTexts = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.get('/api/v1/admin/texts', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTexts(response.data)
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
      }
      console.error('Error fetching texts:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.get('/api/v1/admin/categories', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCategories(response.data)
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
      }
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin/login')
      return
    }
    fetchArtworks()
    fetchEvents()
    fetchTexts()
    fetchCategories()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  const handleDelete = async (id) => {
    if (!window.confirm(language === 'en' ? 'Are you sure you want to delete this artwork?' : '¿Estás seguro de que quieres eliminar esta obra?')) {
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      await axios.delete(`/api/v1/admin/artworks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchArtworks()
    } catch (error) {
      console.error('Error deleting artwork:', error)
      alert(language === 'en' ? 'Error deleting artwork' : 'Error al eliminar la obra')
    }
  }

  const handleDeleteEvent = async (id) => {
    if (!window.confirm(language === 'en' ? 'Are you sure you want to delete this event?' : language === 'it' ? 'Sei sicuro di voler eliminare questo evento?' : '¿Estás seguro de que quieres eliminar este evento?')) {
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      await axios.delete(`/api/v1/admin/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchEvents()
    } catch (error) {
      console.error('Error deleting event:', error)
      alert(language === 'en' ? 'Error deleting event' : language === 'it' ? 'Errore nell\'eliminare l\'evento' : 'Error al eliminar el evento')
    }
  }

  const handleDeleteText = async (key) => {
    if (!window.confirm(language === 'en' ? 'Are you sure you want to delete this text?' : language === 'it' ? 'Sei sicuro di voler eliminare questo testo?' : '¿Estás seguro de que quieres eliminar este texto?')) {
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      await axios.delete(`/api/v1/admin/texts/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      // Refresh texts cache after deleting
      await refreshTextsCache()
      fetchTexts()
    } catch (error) {
      console.error('Error deleting text:', error)
      alert(language === 'en' ? 'Error deleting text' : language === 'it' ? 'Errore nell\'eliminare il testo' : 'Error al eliminar el texto')
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm(language === 'en' ? 'Are you sure you want to delete this category?' : language === 'it' ? 'Sei sicuro di voler eliminare questa categoria?' : '¿Estás seguro de que quieres eliminar esta categoría?')) {
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      await axios.delete(`/api/v1/admin/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      alert(language === 'en' ? 'Error deleting category' : language === 'it' ? 'Errore nell\'eliminare la categoria' : 'Error al eliminar la categoría')
    }
  }

  const handleEdit = (artwork) => {
    setEditingArtwork(artwork)
    setShowForm(true)
  }

  const handleNew = () => {
    setEditingArtwork(null)
    setShowForm(true)
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-loading">
          <p>{language === 'en' ? 'Loading...' : 'Cargando...'}</p>
        </div>
      </div>
    )
  }

  const getActiveTabName = () => {
    switch (activeTab) {
      case 'artworks':
        return t('admin.artworks')
      case 'texts':
        return t('admin.texts')
      case 'carousel':
        return t('admin.carousel')
      case 'events':
        return language === 'en' ? 'Events' : language === 'it' ? 'Eventi' : 'Eventos'
      case 'categories':
        return language === 'en' ? 'Categories' : language === 'it' ? 'Categorie' : 'Categorías'
      case 'artistProfile':
        return language === 'en' ? 'Artist Photo' : language === 'it' ? 'Foto Artista' : 'Foto del Artista'
      default:
        return t('admin.dashboard')
    }
  }

  const tabs = [
    { id: 'artworks', name: t('admin.artworks') },
    { id: 'texts', name: t('admin.texts') },
    { id: 'carousel', name: t('admin.carousel') },
    { id: 'events', name: language === 'en' ? 'Events' : language === 'it' ? 'Eventi' : 'Eventos' },
    { id: 'categories', name: language === 'en' ? 'Categories' : language === 'it' ? 'Categorie' : 'Categorías' },
    { id: 'artistProfile', name: language === 'en' ? 'Artist Photo' : language === 'it' ? 'Foto Artista' : 'Foto del Artista' }
  ]

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setShowBreadcrumbMenu(false)
    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateToPreviousTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab)
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1
    handleTabChange(tabs[previousIndex].id)
  }

  const navigateToNextTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab)
    const nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0
    handleTabChange(tabs[nextIndex].id)
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header" ref={headerRef}>
        <h1 className="admin-dashboard-title">{t('admin.dashboard')}</h1>
        <button onClick={handleLogout} className="admin-logout-btn">
          {t('admin.logout')}
        </button>
      </div>

      <div className={`mobile-breadcrumb ${showBreadcrumb ? 'visible' : ''}`} ref={breadcrumbMenuRef}>
        <button 
          className="breadcrumb-nav-btn breadcrumb-prev" 
          onClick={navigateToPreviousTab}
          aria-label="Previous section"
        >
          ‹
        </button>
        <button 
          className="breadcrumb-text-btn" 
          onClick={() => setShowBreadcrumbMenu(!showBreadcrumbMenu)}
        >
          <span className="breadcrumb-text">{getActiveTabName()}</span>
          <span className="breadcrumb-arrow">▼</span>
        </button>
        <button 
          className="breadcrumb-nav-btn breadcrumb-next" 
          onClick={navigateToNextTab}
          aria-label="Next section"
        >
          ›
        </button>
        {showBreadcrumbMenu && (
          <div className="breadcrumb-menu">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`breadcrumb-menu-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="admin-tabs" ref={tabsRef}>
        <button
          className={`admin-tab ${activeTab === 'artworks' ? 'active' : ''}`}
          onClick={() => handleTabChange('artworks')}
        >
          {t('admin.artworks')}
        </button>
        <button
          className={`admin-tab ${activeTab === 'texts' ? 'active' : ''}`}
          onClick={() => handleTabChange('texts')}
        >
          {t('admin.texts')}
        </button>
        <button
          className={`admin-tab ${activeTab === 'carousel' ? 'active' : ''}`}
          onClick={() => handleTabChange('carousel')}
        >
          {t('admin.carousel')}
        </button>
        <button
          className={`admin-tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => handleTabChange('events')}
        >
          {language === 'en' ? 'Events' : language === 'it' ? 'Eventi' : 'Eventos'}
        </button>
        <button
          className={`admin-tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => handleTabChange('categories')}
        >
          {language === 'en' ? 'Categories' : language === 'it' ? 'Categorie' : 'Categorías'}
        </button>
        <button
          className={`admin-tab ${activeTab === 'artistProfile' ? 'active' : ''}`}
          onClick={() => handleTabChange('artistProfile')}
        >
          {language === 'en' ? 'Artist Photo' : language === 'it' ? 'Foto Artista' : 'Foto del Artista'}
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'artworks' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>{t('admin.manageArtworks')}</h2>
              <button onClick={handleNew} className="admin-add-btn">
                + {t('admin.addArtwork')}
              </button>
            </div>
            {showForm && (
              <ArtworkForm
                artwork={editingArtwork}
                onClose={() => setShowForm(false)}
                onSave={fetchArtworks}
              />
            )}
            <ArtworksList
              artworks={artworks}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}

        {activeTab === 'texts' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>{t('admin.manageTexts')}</h2>
              <button onClick={() => { setEditingText(null); setShowTextForm(true) }} className="admin-add-btn">
                + {language === 'en' ? 'Add Text' : language === 'it' ? 'Aggiungi Testo' : 'Agregar Texto'}
              </button>
            </div>
            {showTextForm && (
              <TextForm
                text={editingText}
                onClose={() => setShowTextForm(false)}
                onSave={fetchTexts}
              />
            )}
            <TextsList
              texts={texts}
              onEdit={(text) => { setEditingText(text); setShowTextForm(true) }}
              onDelete={handleDeleteText}
            />
          </div>
        )}

        {activeTab === 'carousel' && (
          <div className="admin-section">
            <h2>{t('admin.manageCarousel')}</h2>
            <CarouselManager artworks={artworks} onUpdate={fetchArtworks} />
          </div>
        )}

            {activeTab === 'events' && (
              <div className="admin-section">
                <div className="admin-section-header">
                  <h2>{language === 'en' ? 'Manage Portfolio Events' : language === 'it' ? 'Gestisci Eventi del Portfolio' : 'Gestionar Eventos del Portfolio'}</h2>
                  <button onClick={() => { setEditingEvent(null); setShowEventForm(true) }} className="admin-add-btn">
                    + {language === 'en' ? 'Add Event' : language === 'it' ? 'Aggiungi Evento' : 'Agregar Evento'}
                  </button>
                </div>
                {showEventForm && (
                  <EventForm
                    event={editingEvent}
                    onClose={() => setShowEventForm(false)}
                    onSave={fetchEvents}
                  />
                )}
                <EventsList
                  events={events}
                  onEdit={(event) => { setEditingEvent(event); setShowEventForm(true) }}
                  onDelete={handleDeleteEvent}
                />
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="admin-section">
                <div className="admin-section-header">
                  <h2>{language === 'en' ? 'Manage Categories' : language === 'it' ? 'Gestisci Categorie' : 'Gestionar Categorías'}</h2>
                  <button onClick={() => { setEditingCategory(null); setShowCategoryForm(true) }} className="admin-add-btn">
                    + {language === 'en' ? 'Add Category' : language === 'it' ? 'Aggiungi Categoria' : 'Agregar Categoría'}
                  </button>
                </div>
                {showCategoryForm && (
                  <CategoryForm
                    category={editingCategory}
                    onClose={() => setShowCategoryForm(false)}
                    onSave={fetchCategories}
                  />
                )}
                <CategoriesList
                  categories={categories}
                  onEdit={(category) => { setEditingCategory(category); setShowCategoryForm(true) }}
                  onDelete={handleDeleteCategory}
                />
              </div>
            )}

            {activeTab === 'artistProfile' && (
              <div className="admin-section">
                <h2>{language === 'en' ? 'Artist Photo' : language === 'it' ? 'Foto Artista' : 'Foto del Artista'}</h2>
                <ArtistProfileManager />
              </div>
            )}
          </div>
        </div>
      )
    }

function EventsList({ events, onEdit, onDelete }) {
  const { language } = useLanguage()

  const eventTypeLabels = {
    exhibition_individual: language === 'en' ? 'Individual Exhibition' : language === 'it' ? 'Mostra Individuale' : 'Exposición Individual',
    exhibition_duo: language === 'en' ? 'Duo Exhibition' : language === 'it' ? 'Mostra a Due' : 'Exposición a Dúo',
    exhibition_collective: language === 'en' ? 'Collective Exhibition' : language === 'it' ? 'Mostra Collettiva' : 'Exposición Colectiva',
    award: language === 'en' ? 'Award' : language === 'it' ? 'Premio' : 'Premio',
    publication: language === 'en' ? 'Publication' : language === 'it' ? 'Pubblicazione' : 'Publicación',
    upcoming: language === 'en' ? 'Upcoming Event' : language === 'it' ? 'Evento Imminente' : 'Próximo Evento'
  }

  return (
    <div className="events-list">
      {events.length === 0 ? (
        <p className="no-items">{language === 'en' ? 'No events found' : language === 'it' ? 'Nessun evento trovato' : 'No se encontraron eventos'}</p>
      ) : (
        <div className="events-grid-admin">
          {events.map(event => (
            <div key={event.id} className="event-item-admin">
              <div className="event-details-admin">
                <h3>{event.title}</h3>
                <p className="event-meta">
                  <span className="event-type-badge">{eventTypeLabels[event.event_type] || event.event_type}</span>
                  {event.year && <span> • {event.year}</span>}
                </p>
                {event.description && (
                  <p className="event-description">{event.description.substring(0, 100)}...</p>
                )}
              </div>
              <div className="event-actions">
                <button onClick={() => onEdit(event)} className="edit-btn">
                  {language === 'en' ? 'Edit' : language === 'it' ? 'Modifica' : 'Editar'}
                </button>
                <button onClick={() => onDelete(event.id)} className="delete-btn">
                  {language === 'en' ? 'Delete' : language === 'it' ? 'Elimina' : 'Eliminar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function EventForm({ event, onClose, onSave }) {
  const { language } = useLanguage()
  const [activeLangTab, setActiveLangTab] = useState('es')
  const availableLanguages = ['es', 'en', 'it']
  
  const eventTypes = [
    { value: 'exhibition_individual', label: language === 'en' ? 'Individual Exhibition' : language === 'it' ? 'Mostra Individuale' : 'Exposición Individual' },
    { value: 'exhibition_duo', label: language === 'en' ? 'Duo Exhibition' : language === 'it' ? 'Mostra a Due' : 'Exposición a Dúo' },
    { value: 'exhibition_collective', label: language === 'en' ? 'Collective Exhibition' : language === 'it' ? 'Mostra Collettiva' : 'Exposición Colectiva' },
    { value: 'award', label: language === 'en' ? 'Award' : language === 'it' ? 'Premio' : 'Premio' },
    { value: 'publication', label: language === 'en' ? 'Publication' : language === 'it' ? 'Pubblicazione' : 'Publicación' },
    { value: 'upcoming', label: language === 'en' ? 'Upcoming Event' : language === 'it' ? 'Evento Imminente' : 'Próximo Evento' }
  ]
  
  const initTranslations = () => {
    if (event?.translations) {
      return {
        es: {
          title: event.translations.es?.title || event?.title || '',
          description: event.translations.es?.description || event?.description || ''
        },
        en: {
          title: event.translations.en?.title || '',
          description: event.translations.en?.description || ''
        },
        it: {
          title: event.translations.it?.title || '',
          description: event.translations.it?.description || ''
        }
      }
    }
    return {
      es: {
        title: event?.title || '',
        description: event?.description || ''
      },
      en: {
        title: event?.translations?.en?.title || '',
        description: event?.translations?.en?.description || ''
      },
      it: {
        title: event?.translations?.it?.title || '',
        description: event?.translations?.it?.description || ''
      }
    }
  }
  
  const [translations, setTranslations] = useState(initTranslations())
  const [formData, setFormData] = useState({
    event_type: event?.event_type || 'exhibition_individual',
    year: event?.year || new Date().getFullYear(),
    display_order: event?.display_order || 0
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }
  
  const handleTranslationChange = (lang, field, value) => {
    setTranslations(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value
      }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const token = localStorage.getItem('adminToken')
      const url = event
        ? `/api/v1/admin/events/${event.id}`
        : '/api/v1/admin/events'
      const method = event ? 'put' : 'post'

      const submitData = new FormData()
      
      submitData.append('event_type', formData.event_type)
      submitData.append('title', translations.es.title || translations.en.title || '')
      submitData.append('description', translations.es.description || '')
      submitData.append('year', formData.year)
      submitData.append('display_order', formData.display_order)
      submitData.append('translations', JSON.stringify(translations))

      await axios[method](url, submitData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving event:', error)
      alert(language === 'en' ? 'Error saving event' : language === 'it' ? 'Errore nel salvare l\'evento' : 'Error al guardar el evento')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="artwork-form-overlay">
      <div className="artwork-form-modal">
        <div className="artwork-form-header">
          <h2>{event ? (language === 'en' ? 'Edit Event' : language === 'it' ? 'Modifica Evento' : 'Editar Evento') : (language === 'en' ? 'Add Event' : language === 'it' ? 'Aggiungi Evento' : 'Agregar Evento')}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <form onSubmit={handleSubmit} className="artwork-form">
          <div className="form-group">
            <label>{language === 'en' ? 'Event Type' : language === 'it' ? 'Tipo di Evento' : 'Tipo de Evento'}</label>
            <select
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
              required
            >
              {eventTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Language Tabs for Translations */}
          <div className="translation-tabs">
            <div className="translation-tabs-header">
              <span className="translation-label">{language === 'en' ? 'Translations' : language === 'it' ? 'Traduzioni' : 'Traducciones'}:</span>
              {availableLanguages.map(lang => (
                <button
                  key={lang}
                  type="button"
                  className={`translation-tab ${activeLangTab === lang ? 'active' : ''}`}
                  onClick={() => setActiveLangTab(lang)}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            
            {availableLanguages.map(lang => (
              <div key={lang} className={`translation-content ${activeLangTab === lang ? 'active' : ''}`}>
                <div className="form-group">
                  <label>{language === 'en' ? 'Title' : language === 'it' ? 'Titolo' : 'Título'} ({lang.toUpperCase()})</label>
                  <input
                    type="text"
                    value={translations[lang]?.title || ''}
                    onChange={(e) => handleTranslationChange(lang, 'title', e.target.value)}
                    required={lang === 'es'}
                    placeholder={lang === 'es' ? (language === 'en' ? 'Required' : language === 'it' ? 'Richiesto' : 'Requerido') : (language === 'en' ? 'Optional' : language === 'it' ? 'Opzionale' : 'Opcional')}
                  />
                </div>
                <div className="form-group">
                  <label>{language === 'en' ? 'Description' : language === 'it' ? 'Descrizione' : 'Descripción'} ({lang.toUpperCase()})</label>
                  <textarea
                    value={translations[lang]?.description || ''}
                    onChange={(e) => handleTranslationChange(lang, 'description', e.target.value)}
                    rows="4"
                    placeholder={lang === 'es' ? (language === 'en' ? 'Required' : language === 'it' ? 'Richiesto' : 'Requerido') : (language === 'en' ? 'Optional' : language === 'it' ? 'Opzionale' : 'Opcional')}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{language === 'en' ? 'Year' : language === 'it' ? 'Anno' : 'Año'}</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>{language === 'en' ? 'Display Order' : language === 'it' ? 'Ordine di Visualizzazione' : 'Orden de Visualización'}</label>
              <input
                type="number"
                name="display_order"
                value={formData.display_order}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              {language === 'en' ? 'Cancel' : language === 'it' ? 'Annulla' : 'Cancelar'}
            </button>
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? (language === 'en' ? 'Saving...' : language === 'it' ? 'Salvataggio...' : 'Guardando...') : (language === 'en' ? 'Save' : language === 'it' ? 'Salva' : 'Guardar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ArtworksList({ artworks, onEdit, onDelete }) {
  const { language } = useLanguage()

  return (
    <div className="artworks-list">
      {artworks.length === 0 ? (
        <p className="no-items">{language === 'en' ? 'No artworks found' : 'No se encontraron obras'}</p>
      ) : (
        <div className="artworks-grid-admin">
          {artworks.map(artwork => (
            <div key={artwork.id} className="artwork-item-admin">
              <img src={artwork.image_url} alt={artwork.title} className="artwork-thumbnail" />
              <div className="artwork-details-admin">
                <h3>{artwork.title}</h3>
                <p className="artwork-meta">{artwork.category} • {artwork.year}</p>
                {artwork.for_sale && (
                  <p className="artwork-price-admin">${artwork.price?.toLocaleString()}</p>
                )}
              </div>
              <div className="artwork-actions">
                <button onClick={() => onEdit(artwork)} className="edit-btn">
                  {language === 'en' ? 'Edit' : 'Editar'}
                </button>
                <button onClick={() => onDelete(artwork.id)} className="delete-btn">
                  {language === 'en' ? 'Delete' : 'Eliminar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ArtworkForm({ artwork, onClose, onSave }) {
  const { language } = useLanguage()
  const [activeLangTab, setActiveLangTab] = useState('es')
  const availableLanguages = ['es', 'en', 'it'] // Easy to add more languages here
  
  // Initialize translations from artwork or empty
  const initTranslations = () => {
    if (artwork?.translations) {
      return {
        es: {
          title: artwork.translations.es?.title || artwork?.title || '',
          description: artwork.translations.es?.description || artwork?.description || '',
          category: artwork.translations.es?.category || artwork?.category || '',
          theme: artwork.translations.es?.theme || artwork?.theme || ''
        },
        en: {
          title: artwork.translations.en?.title || '',
          description: artwork.translations.en?.description || '',
          category: artwork.translations.en?.category || '',
          theme: artwork.translations.en?.theme || ''
        },
        it: {
          title: artwork.translations.it?.title || '',
          description: artwork.translations.it?.description || '',
          category: artwork.translations.it?.category || '',
          theme: artwork.translations.it?.theme || ''
        }
      }
    }
    return {
      es: {
        title: artwork?.title || '',
        description: artwork?.description || '',
        category: artwork?.category || '',
        theme: artwork?.theme || ''
      },
      en: {
        title: artwork?.translations?.en?.title || '',
        description: artwork?.translations?.en?.description || '',
        category: artwork?.translations?.en?.category || '',
        theme: artwork?.translations?.en?.theme || ''
      },
      it: {
        title: artwork?.translations?.it?.title || '',
        description: artwork?.translations?.it?.description || '',
        category: artwork?.translations?.it?.category || '',
        theme: artwork?.translations?.it?.theme || ''
      }
    }
  }
  
  const [translations, setTranslations] = useState(initTranslations())
  const [formData, setFormData] = useState({
    year: artwork?.year || new Date().getFullYear(),
    for_sale: artwork?.for_sale || false,
    price: artwork?.price || '',
    in_carousel: artwork?.in_carousel || false,
    image_url: artwork?.image_url || ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(artwork?.image_url || null)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        const response = await axios.get('/api/v1/admin/categories', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setCategories(response.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }
  
  const handleTranslationChange = (lang, field, value) => {
    setTranslations(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value
      }
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const token = localStorage.getItem('adminToken')
      const url = artwork
        ? `/api/v1/admin/artworks/${artwork.id}`
        : '/api/v1/admin/artworks'
      const method = artwork ? 'put' : 'post'

      const submitData = new FormData()
      
      // Use Spanish as default/fallback for title (required field)
      submitData.append('title', translations.es.title || translations.en.title || '')
      submitData.append('description', translations.es.description || '')
      submitData.append('category', translations.es.category || '')
      submitData.append('theme', translations.es.theme || '')
      
      // Append translations as JSON
      submitData.append('translations', JSON.stringify(translations))
      
      submitData.append('year', formData.year)
      submitData.append('for_sale', formData.for_sale)
      submitData.append('in_carousel', formData.in_carousel)
      if (formData.price) {
        submitData.append('price', formData.price)
      }
      
      // Only include image_url if no file is being uploaded
      if (!imageFile && formData.image_url) {
        submitData.append('image_url', formData.image_url)
      }
      
      // Include image file if selected
      if (imageFile) {
        submitData.append('image', imageFile)
      }

      await axios[method](url, submitData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving artwork:', error)
      alert(language === 'en' ? 'Error saving artwork' : 'Error al guardar la obra')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="artwork-form-overlay">
      <div className="artwork-form-modal">
        <div className="artwork-form-header">
          <h2>{artwork ? (language === 'en' ? 'Edit Artwork' : 'Editar Obra') : (language === 'en' ? 'Add Artwork' : 'Agregar Obra')}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <form onSubmit={handleSubmit} className="artwork-form">
          {/* Language Tabs for Translations */}
          <div className="translation-tabs">
            <div className="translation-tabs-header">
              <span className="translation-label">{language === 'en' ? 'Translations' : 'Traducciones'}:</span>
              {availableLanguages.map(lang => (
                <button
                  key={lang}
                  type="button"
                  className={`translation-tab ${activeLangTab === lang ? 'active' : ''}`}
                  onClick={() => setActiveLangTab(lang)}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            
            {availableLanguages.map(lang => (
              <div key={lang} className={`translation-content ${activeLangTab === lang ? 'active' : ''}`}>
                <div className="form-row">
                  <div className="form-group">
                    <label>{language === 'en' ? 'Title' : 'Título'} ({lang.toUpperCase()})</label>
                    <input
                      type="text"
                      value={translations[lang]?.title || ''}
                      onChange={(e) => handleTranslationChange(lang, 'title', e.target.value)}
                      required={lang === 'es'}
                      placeholder={lang === 'es' ? (language === 'en' ? 'Required' : 'Requerido') : (language === 'en' ? 'Optional' : 'Opcional')}
                    />
                  </div>
                  <div className="form-group">
                    <label>{language === 'en' ? 'Category' : 'Categoría'} ({lang.toUpperCase()})</label>
                    <input
                      type="text"
                      list={`category-options-${lang}`}
                      value={translations[lang]?.category || ''}
                      onChange={(e) => handleTranslationChange(lang, 'category', e.target.value)}
                      placeholder={lang === 'es' ? (language === 'en' ? 'Required' : 'Requerido') : (language === 'en' ? 'Optional' : 'Opcional')}
                      required={lang === 'es'}
                    />
                    <datalist id={`category-options-${lang}`}>
                      {categories.map(category => {
                        const categoryName = category.translations?.[lang]?.name || category.translations?.es?.name || category.name
                        return (
                          <option key={category.id} value={categoryName}>
                            {categoryName}
                          </option>
                        )
                      })}
                    </datalist>
                  </div>
                  <div className="form-group">
                    <label>{language === 'en' ? 'Theme' : 'Tema'} ({lang.toUpperCase()})</label>
                    <input
                      type="text"
                      value={translations[lang]?.theme || ''}
                      onChange={(e) => handleTranslationChange(lang, 'theme', e.target.value)}
                      placeholder={lang === 'es' ? (language === 'en' ? 'Optional' : 'Opcional') : (language === 'en' ? 'Optional' : 'Opcional')}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>{language === 'en' ? 'Description' : 'Descripción'} ({lang.toUpperCase()})</label>
                  <textarea
                    value={translations[lang]?.description || ''}
                    onChange={(e) => handleTranslationChange(lang, 'description', e.target.value)}
                    rows="4"
                    placeholder={lang === 'es' ? (language === 'en' ? 'Required' : 'Requerido') : (language === 'en' ? 'Optional' : 'Opcional')}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{language === 'en' ? 'Year' : 'Año'}</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="for_sale"
                  checked={formData.for_sale}
                  onChange={handleChange}
                />
                {language === 'en' ? 'For Sale' : 'En Venta'}
              </label>
            </div>
            {formData.for_sale && (
              <div className="form-group">
                <label>{language === 'en' ? 'Price' : 'Precio'}</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>
          <div className="form-group">
            <label>{language === 'en' ? 'Image' : 'Imagen'}</label>
            <div className="image-upload-section">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
              <div className="image-url-fallback">
                <label>{language === 'en' ? 'Or enter image URL:' : 'O ingrese URL de imagen:'}</label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder={language === 'en' ? 'https://example.com/image.jpg' : 'https://ejemplo.com/imagen.jpg'}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="in_carousel"
                checked={formData.in_carousel}
                onChange={handleChange}
              />
              {language === 'en' ? 'Show in Carousel' : 'Mostrar en Carrusel'}
            </label>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              {language === 'en' ? 'Cancel' : 'Cancelar'}
            </button>
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? (language === 'en' ? 'Saving...' : 'Guardando...') : (language === 'en' ? 'Save' : 'Guardar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CarouselManager({ artworks, onUpdate }) {
  const { language } = useLanguage()
  const [carouselArtworkIds, setCarouselArtworkIds] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCarouselArtworks()
  }, [])

  const fetchCarouselArtworks = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.get('/api/v1/admin/carousel', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const ids = new Set(response.data.map(a => a.id))
      setCarouselArtworkIds(ids)
    } catch (error) {
      console.error('Error fetching carousel:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (artworkId, inCarousel) => {
    try {
      const token = localStorage.getItem('adminToken')
      await axios.put(
        `/api/v1/admin/carousel/${artworkId}`,
        { in_carousel: !inCarousel },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      // Update local state immediately
      setCarouselArtworkIds(prev => {
        const newSet = new Set(prev)
        if (inCarousel) {
          newSet.delete(artworkId)
        } else {
          newSet.add(artworkId)
        }
        return newSet
      })
      fetchCarouselArtworks()
      onUpdate()
    } catch (error) {
      console.error('Error updating carousel:', error)
      alert(language === 'en' ? 'Error updating carousel' : 'Error al actualizar el carrusel')
    }
  }

  if (loading) {
    return <p>{language === 'en' ? 'Loading...' : 'Cargando...'}</p>
  }

  return (
    <div className="carousel-manager">
      <p className="carousel-instructions">
        {language === 'en' 
          ? 'Select which artworks should appear in the home carousel:' 
          : 'Selecciona qué obras deben aparecer en el carrusel de inicio:'}
      </p>
      <div className="carousel-artworks-list">
        {artworks.map(artwork => {
          const inCarousel = carouselArtworkIds.has(artwork.id)
          return (
            <div key={artwork.id} className="carousel-item">
              <img src={artwork.image_url} alt={artwork.title} className="carousel-thumbnail" />
              <div className="carousel-item-info">
                <h4>{artwork.title}</h4>
                <label className="carousel-toggle">
                  <input
                    type="checkbox"
                    checked={inCarousel}
                    onChange={() => handleToggle(artwork.id, inCarousel)}
                  />
                  {language === 'en' ? 'Show in carousel' : 'Mostrar en carrusel'}
                </label>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TextsList({ texts, onEdit, onDelete }) {
  const { language } = useLanguage()

  return (
    <div className="texts-list">
      {texts.length === 0 ? (
        <p className="no-items">{language === 'en' ? 'No texts found' : language === 'it' ? 'Nessun testo trovato' : 'No se encontraron textos'}</p>
      ) : (
        <div className="texts-grid-admin">
          {texts.map(text => (
            <div key={text.key} className="text-item-admin">
              <div className="text-details-admin">
                <h3>{text.key}</h3>
                {text.description && (
                  <p className="text-description">{text.description}</p>
                )}
                <div className="text-preview">
                  <strong>{language === 'en' ? 'Preview' : language === 'it' ? 'Anteprima' : 'Vista previa'}:</strong>
                  <p>{text.translations?.[language] || text.translations?.es || '(No translation)'}</p>
                </div>
              </div>
              <div className="text-actions">
                <button onClick={() => onEdit(text)} className="edit-btn">
                  {language === 'en' ? 'Edit' : language === 'it' ? 'Modifica' : 'Editar'}
                </button>
                <button onClick={() => onDelete(text.key)} className="delete-btn">
                  {language === 'en' ? 'Delete' : language === 'it' ? 'Elimina' : 'Eliminar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TextForm({ text, onClose, onSave }) {
  const { language } = useLanguage()
  const [activeLangTab, setActiveLangTab] = useState('es')
  const availableLanguages = ['es', 'en', 'it']
  
  const initTranslations = () => {
    if (text?.translations) {
      return {
        es: text.translations.es || '',
        en: text.translations.en || '',
        it: text.translations.it || ''
      }
    }
    return {
      es: '',
      en: '',
      it: ''
    }
  }
  
  const [translations, setTranslations] = useState(initTranslations())
  const [formData, setFormData] = useState({
    key: text?.key || '',
    description: text?.description || ''
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  
  const handleTranslationChange = (lang, value) => {
    setTranslations(prev => ({
      ...prev,
      [lang]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const token = localStorage.getItem('adminToken')
      const url = text
        ? `/api/v1/admin/texts/${encodeURIComponent(text.key)}`
        : '/api/v1/admin/texts'
      const method = text ? 'put' : 'post'

      const submitData = new FormData()
      
      submitData.append('key', formData.key)
      submitData.append('description', formData.description)
      submitData.append('translations', JSON.stringify(translations))

      await axios[method](url, submitData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      // Refresh texts cache after saving
      await refreshTextsCache()
      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving text:', error)
      alert(language === 'en' ? 'Error saving text' : language === 'it' ? 'Errore nel salvare il testo' : 'Error al guardar el texto')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="artwork-form-overlay">
      <div className="artwork-form-modal">
        <div className="artwork-form-header">
          <h2>{text ? (language === 'en' ? 'Edit Text' : language === 'it' ? 'Modifica Testo' : 'Editar Texto') : (language === 'en' ? 'Add Text' : language === 'it' ? 'Aggiungi Testo' : 'Agregar Texto')}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <form onSubmit={handleSubmit} className="artwork-form">
          <div className="form-group">
            <label>{language === 'en' ? 'Key' : language === 'it' ? 'Chiave' : 'Clave'} (e.g., "home.quote")</label>
            <input
              type="text"
              name="key"
              value={formData.key}
              onChange={handleChange}
              required
              disabled={!!text}
              placeholder="home.quote"
            />
            {text && (
              <small>{language === 'en' ? 'Key cannot be changed after creation' : language === 'it' ? 'La chiave non può essere modificata dopo la creazione' : 'La clave no puede cambiarse después de la creación'}</small>
            )}
          </div>

          <div className="form-group">
            <label>{language === 'en' ? 'Description' : language === 'it' ? 'Descrizione' : 'Descripción'} ({language === 'en' ? 'Optional' : language === 'it' ? 'Opzionale' : 'Opcional'})</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={language === 'en' ? 'Brief description for admin reference' : language === 'it' ? 'Breve descrizione per riferimento admin' : 'Breve descripción para referencia del administrador'}
            />
          </div>

          {/* Language Tabs for Translations */}
          <div className="translation-tabs">
            <div className="translation-tabs-header">
              <span className="translation-label">{language === 'en' ? 'Translations' : language === 'it' ? 'Traduzioni' : 'Traducciones'}:</span>
              {availableLanguages.map(lang => (
                <button
                  key={lang}
                  type="button"
                  className={`translation-tab ${activeLangTab === lang ? 'active' : ''}`}
                  onClick={() => setActiveLangTab(lang)}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            
            {availableLanguages.map(lang => (
              <div key={lang} className={`translation-content ${activeLangTab === lang ? 'active' : ''}`}>
                <div className="form-group">
                  <label>{language === 'en' ? 'Text' : language === 'it' ? 'Testo' : 'Texto'} ({lang.toUpperCase()})</label>
                  <textarea
                    value={translations[lang] || ''}
                    onChange={(e) => handleTranslationChange(lang, e.target.value)}
                    rows="4"
                    required={lang === 'es'}
                    placeholder={lang === 'es' ? (language === 'en' ? 'Required' : language === 'it' ? 'Richiesto' : 'Requerido') : (language === 'en' ? 'Optional' : language === 'it' ? 'Opzionale' : 'Opcional')}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              {language === 'en' ? 'Cancel' : language === 'it' ? 'Annulla' : 'Cancelar'}
            </button>
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? (language === 'en' ? 'Saving...' : language === 'it' ? 'Salvataggio...' : 'Guardando...') : (language === 'en' ? 'Save' : language === 'it' ? 'Salva' : 'Guardar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ArtistProfileManager() {
  const { language } = useLanguage()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.get('/api/v1/admin/artist_profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProfile(response.data)
      if (response.data.photo_url) {
        setPreview(response.data.photo_url)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedFile && !profile?.photo_url) {
      alert(language === 'en' ? 'Please select a photo to upload' : language === 'it' ? 'Seleziona una foto da caricare' : 'Por favor selecciona una foto para subir')
      return
    }

    setUploading(true)

    try {
      const token = localStorage.getItem('adminToken')
      const formData = new FormData()
      
      if (selectedFile) {
        formData.append('photo', selectedFile)
      }

      await axios.put('/api/v1/admin/artist_profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      alert(language === 'en' ? 'Photo updated successfully!' : language === 'it' ? 'Foto aggiornata con successo!' : '¡Foto actualizada exitosamente!')
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      fetchProfile()
    } catch (error) {
      console.error('Error updating photo:', error)
      alert(language === 'en' ? 'Error updating photo' : language === 'it' ? 'Errore nell\'aggiornare la foto' : 'Error al actualizar la foto')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    if (!window.confirm(language === 'en' ? 'Are you sure you want to remove the photo?' : language === 'it' ? 'Sei sicuro di voler rimuovere la foto?' : '¿Estás seguro de que quieres eliminar la foto?')) {
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      const formData = new FormData()
      formData.append('remove_photo', 'true')
      
      await axios.put('/api/v1/admin/artist_profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      setPreview(null)
      fetchProfile()
      alert(language === 'en' ? 'Photo removed successfully!' : language === 'it' ? 'Foto rimossa con successo!' : '¡Foto eliminada exitosamente!')
    } catch (error) {
      console.error('Error removing photo:', error)
      alert(language === 'en' ? 'Error removing photo' : language === 'it' ? 'Errore nella rimozione della foto' : 'Error al eliminar la foto')
    }
  }

  if (loading) {
    return <p>{language === 'en' ? 'Loading...' : language === 'it' ? 'Caricamento...' : 'Cargando...'}</p>
  }

  return (
    <div className="artist-profile-manager">
      <div className="profile-preview">
        {preview || profile?.photo_url ? (
          <img src={preview || profile.photo_url} alt="Artist" className="profile-preview-image" />
        ) : (
          <div className="profile-placeholder">
            <div className="profile-placeholder-initials">MQ</div>
            <p>{language === 'en' ? 'No photo uploaded' : language === 'it' ? 'Nessuna foto caricata' : 'No hay foto cargada'}</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="artist-photo-input" className="file-input-label">
            {language === 'en' ? 'Choose Photo' : language === 'it' ? 'Scegli Foto' : 'Elegir Foto'}
          </label>
          <input
            type="file"
            id="artist-photo-input"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
          {selectedFile && (
            <p className="file-selected-text">
              {language === 'en' ? 'Selected: ' : language === 'it' ? 'Selezionato: ' : 'Seleccionado: '}
              {selectedFile.name}
            </p>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={uploading || (!selectedFile && !profile?.photo_url)}>
            {uploading 
              ? (language === 'en' ? 'Uploading...' : language === 'it' ? 'Caricamento...' : 'Subiendo...')
              : (language === 'en' ? 'Upload Photo' : language === 'it' ? 'Carica Foto' : 'Subir Foto')
            }
          </button>
          {profile?.photo_attached && (
            <button type="button" onClick={handleRemove} className="delete-btn">
              {language === 'en' ? 'Remove Photo' : language === 'it' ? 'Rimuovi Foto' : 'Eliminar Foto'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

function CategoriesList({ categories, onEdit, onDelete }) {
  const { language } = useLanguage()

  return (
    <div className="texts-list">
      {categories.length === 0 ? (
        <p className="no-items">{language === 'en' ? 'No categories found' : language === 'it' ? 'Nessuna categoria trovata' : 'No se encontraron categorías'}</p>
      ) : (
        <div className="texts-grid-admin">
          {categories.map(category => {
            const displayName = category.translations?.[language]?.name || category.translations?.es?.name || category.name
            return (
              <div key={category.id} className="text-item-admin">
                <div className="text-details-admin">
                  <h3>{displayName}</h3>
                  <p className="text-description">
                    {language === 'en' ? 'Base name' : language === 'it' ? 'Nome base' : 'Nombre base'}: {category.name}
                  </p>
                  <div className="text-preview">
                    <strong>{language === 'en' ? 'Translations' : language === 'it' ? 'Traduzioni' : 'Traducciones'}:</strong>
                    <p>
                      ES: {category.translations?.es?.name || category.name}<br />
                      EN: {category.translations?.en?.name || '-'}<br />
                      IT: {category.translations?.it?.name || '-'}
                    </p>
                  </div>
                </div>
                <div className="text-actions">
                  <button onClick={() => onEdit(category)} className="edit-btn">
                    {language === 'en' ? 'Edit' : language === 'it' ? 'Modifica' : 'Editar'}
                  </button>
                  <button onClick={() => onDelete(category.id)} className="delete-btn">
                    {language === 'en' ? 'Delete' : language === 'it' ? 'Elimina' : 'Eliminar'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function CategoryForm({ category, onClose, onSave }) {
  const { language } = useLanguage()
  const [activeLangTab, setActiveLangTab] = useState('es')
  const availableLanguages = ['es', 'en', 'it']
  
  const initTranslations = () => {
    if (category?.translations) {
      return {
        es: {
          name: category.translations.es?.name || category?.name || ''
        },
        en: {
          name: category.translations.en?.name || ''
        },
        it: {
          name: category.translations.it?.name || ''
        }
      }
    }
    return {
      es: {
        name: category?.name || ''
      },
      en: {
        name: category?.translations?.en?.name || ''
      },
      it: {
        name: category?.translations?.it?.name || ''
      }
    }
  }
  
  const [translations, setTranslations] = useState(initTranslations())
  const [saving, setSaving] = useState(false)

  const handleTranslationChange = (lang, field, value) => {
    setTranslations(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value
      }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const token = localStorage.getItem('adminToken')
      const url = category
        ? `/api/v1/admin/categories/${category.id}`
        : '/api/v1/admin/categories'
      const method = category ? 'put' : 'post'

      const submitData = {
        name: translations.es.name || translations.en.name || '',
        translations: translations
      }

      await axios[method](url, submitData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving category:', error)
      alert(language === 'en' ? 'Error saving category' : language === 'it' ? 'Errore nel salvare la categoria' : 'Error al guardar la categoría')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="artwork-form-overlay">
      <div className="artwork-form-modal">
        <div className="artwork-form-header">
          <h2>{category ? (language === 'en' ? 'Edit Category' : language === 'it' ? 'Modifica Categoria' : 'Editar Categoría') : (language === 'en' ? 'Add Category' : language === 'it' ? 'Aggiungi Categoria' : 'Agregar Categoría')}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <form onSubmit={handleSubmit} className="artwork-form">
          <div className="translation-tabs">
            <div className="translation-tabs-header">
              <span className="translation-label">{language === 'en' ? 'Translations' : language === 'it' ? 'Traduzioni' : 'Traducciones'}:</span>
              {availableLanguages.map(lang => (
                <button
                  key={lang}
                  type="button"
                  className={`translation-tab ${activeLangTab === lang ? 'active' : ''}`}
                  onClick={() => setActiveLangTab(lang)}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            
            {availableLanguages.map(lang => (
              <div key={lang} className={`translation-content ${activeLangTab === lang ? 'active' : ''}`}>
                <div className="form-group">
                  <label>{language === 'en' ? 'Name' : language === 'it' ? 'Nome' : 'Nombre'} ({lang.toUpperCase()})</label>
                  <input
                    type="text"
                    value={translations[lang]?.name || ''}
                    onChange={(e) => handleTranslationChange(lang, 'name', e.target.value)}
                    required={lang === 'es'}
                    placeholder={lang === 'es' ? (language === 'en' ? 'Required' : 'Requerido') : (language === 'en' ? 'Optional' : 'Opcional')}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              {language === 'en' ? 'Cancel' : language === 'it' ? 'Annulla' : 'Cancelar'}
            </button>
            <button type="submit" disabled={saving} className="save-btn">
              {saving ? (language === 'en' ? 'Saving...' : language === 'it' ? 'Salvataggio...' : 'Guardando...') : (language === 'en' ? 'Save' : language === 'it' ? 'Salva' : 'Guardar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminDashboard

