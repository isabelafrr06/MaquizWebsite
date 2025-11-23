import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../utils/translations'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './Contact.css'

function Contact() {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real application, you would send this to a backend API
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <div className="contact-page">
      <Header />
      <main className="contact-main">
        <section className="contact-hero">
          <h1 className="contact-hero-title">{t('contact.title')}</h1>
          <p className="contact-hero-subtitle">{t('contact.infoText')}</p>
        </section>

        <section className="contact-content">
          <div className="contact-wrapper">

            <div className="contact-options-section">
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

            {!showForm && (
              <div className="contact-form-toggle-section">
                <button 
                  onClick={() => setShowForm(true)} 
                  className="show-form-btn"
                >
                  {t('contact.showForm')}
                </button>
              </div>
            )}

            {showForm && (
              <div className="contact-form-section">
                <div className="form-header">
                  <h3>{t('contact.formTitle')}</h3>
                  <button 
                    onClick={() => setShowForm(false)} 
                    className="close-form-btn"
                    aria-label="Close form"
                  >
                    ×
                  </button>
                </div>
                
                <div className="contact-form-container">
                <form className="contact-form" onSubmit={handleSubmit}>
                  {submitted && (
                    <div className="success-message">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                      </svg>
                      {t('contact.successMessage')}
                    </div>
                  )}
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">{t('contact.name')}</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t('contact.placeholderName')}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">{t('contact.email')}</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t('contact.placeholderEmail')}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">{t('contact.subject')}</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={t('contact.placeholderSubject')}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">{t('contact.message')}</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      placeholder={t('contact.placeholderMessage')}
                      required
                    />
                  </div>

                  <button type="submit" className="submit-btn">
                    <span>{t('contact.send')}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
                    </svg>
                  </button>
                </form>
              </div>
            </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Contact



