import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../utils/translations'
import Header from '../components/Header'
import Footer from '../components/Footer'
import axios from 'axios'
import './About.css'

function About() {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const [openSections, setOpenSections] = useState({
    artisticFocus: false,
    exhibitions: false,
    awards: false,
    publications: false,
    upcoming: false
  })
  const [events, setEvents] = useState({
    exhibitions_individual: [],
    exhibitions_duo: [],
    exhibitions_collective: [],
    awards: [],
    publications: [],
    upcoming: []
  })
  const [loading, setLoading] = useState(true)
  const [nameVisible, setNameVisible] = useState(true)
  const [artistPhoto, setArtistPhoto] = useState(null)
  const [artistInfo, setArtistInfo] = useState(null)

  useEffect(() => {
    fetchEvents()
    fetchArtistProfile()
  }, [language])

  useEffect(() => {
    const nameElement = document.querySelector('.about-text-section .artist-name')
    if (!nameElement) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setNameVisible(entry.isIntersecting)
        })
      },
      {
        threshold: 0.1,
        rootMargin: '-100px 0px'
      }
    )

    observer.observe(nameElement)

    return () => {
      observer.disconnect()
    }
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`/api/v1/events?locale=${language}`)
      setEvents(response.data)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchArtistProfile = async () => {
    try {
      const response = await axios.get(`/api/v1/artist_profile?locale=${language}`)
      if (response.data.photo_url) {
        setArtistPhoto(response.data.photo_url)
      } else {
        setArtistPhoto(null)
      }
      // Store artist information from database
      setArtistInfo(response.data)
    } catch (error) {
      console.error('Error fetching artist profile:', error)
      setArtistPhoto(null)
      setArtistInfo(null)
    }
  }

  // Helper function to get artist info, fallback to translations
  const getArtistInfo = (field) => {
    if (artistInfo && artistInfo[field]) {
      return artistInfo[field]
    }
    // Fallback to static translations
    return t(`artist.${field}`)
  }

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Use events from API, fallback to empty arrays if loading
  let exhibitions = {
    individual: [...(events.exhibitions_individual || [])],
    duo: [...(events.exhibitions_duo || [])],
    collective: [...(events.exhibitions_collective || [])]
  }
  let awards = [...(events.awards || [])]
  let publications = [...(events.publications || [])]
  const upcomingEvents = [...(events.upcoming || [])]

  // Legacy fallback data (kept for reference, but API data takes precedence)
  const getExhibitions = () => {
    if (language === 'es') {
      return {
        individual: [
          '2017 Sistemas Galileo, Barreal de Heredia, Costa Rica',
          '2017 Galería de Arte Isaac Barcat, sala III',
          '2015 Casa Universitaria del Libro, UNAM. México DF Salón de los Vitrales',
          '2013 Casona de Laly, Escazú',
          '2012 Escuela de Artes Musicales, Universidad de Costa Rica',
          '2011 Correo Central, San José (20 nov.- 2 dic.)',
          '2010 Correo Central, San José (20 dic.- 7 enero)'
        ],
        duo: [
          '2019 Vicerrectoría de Acción Social Universidad de Costa Rica, San José, Costa Rica',
          '2018 Correo Central, San José, Costa Rica',
          '2015 Instituto de México, San Pedro. Pintura e inauguración y presentación del libro de poemas En las Mejillas del Tiempo',
          '2012 Casa Cultural La Guaricha, David, Chiriquí, Panamá',
          '2010 Hotel El Tirol (marzo-diciembre)',
          '2009 Sistemas Galileo- Barreal de Heredia (diciembre)'
        ],
        collective: [
          '2022-2024 Múltiples exposiciones digitales y presenciales en diversos países',
          '2021 1ra Bienal Internacional de Arte Visual, Universidad de Panamá',
          '2020 Dubai Print Festival, Museo de las Américas',
          '2019 Exposición Internacional de Arte Contemporáneo, Festival de Arte, Plaza de la República, Roma, Italia',
          '2019 Festival Intercultural Guayaquil Puerto de las Artes y las Culturas, Ecuador',
          '2017-2024 Exposiciones internacionales con Mondial Art Academia (MAA) en Costa Rica, Colombia, España, Italia, Ecuador, Perú, Argentina, Suiza, Venezuela, Panamá, Turquía, India, Corea del Sur, Francia, Canadá, Cuba, Australia, Dinamarca',
          '2002-2019 Múltiples exposiciones en Casa del Artista, FANAL, OUTLET MALL, y otros espacios en Costa Rica'
        ]
      }
    } else if (language === 'it') {
      return {
        individual: [
          '2017 Sistemi Galileo, Barreal de Heredia, Costa Rica',
          '2017 Galleria d\'Arte Isaac Barcat, sala III',
          '2015 Casa Universitaria del Libro, UNAM. Messico DF Salone dei Vitrali',
          '2013 Casona de Laly, Escazú',
          '2012 Scuola di Arti Musicali, Università della Costa Rica',
          '2011 Ufficio Postale Centrale, San José (20 nov - 2 dic)',
          '2010 Ufficio Postale Centrale, San José (20 dic - 7 gen)'
        ],
        duo: [
          '2019 Vice-Rettorato di Azione Sociale, Università della Costa Rica, San José, Costa Rica',
          '2018 Ufficio Postale Centrale, San José, Costa Rica',
          '2015 Istituto del Messico, San Pedro. Pittura e inaugurazione e presentazione del libro di poesie En las Mejillas del Tiempo',
          '2012 Casa Culturale La Guaricha, David, Chiriquí, Panama',
          '2010 Hotel El Tirol (marzo-dicembre)',
          '2009 Sistemi Galileo - Barreal de Heredia (dicembre)'
        ],
        collective: [
          '2022-2024 Multiple mostre digitali e in presenza in vari paesi',
          '2021 1a Biennale Internazionale di Arte Visiva, Università di Panama',
          '2020 Dubai Print Festival, Museo delle Americhe',
          '2019 Mostra Internazionale di Arte Contemporanea, Festival dell\'Arte, Piazza della Repubblica, Roma, Italia',
          '2019 Festival Interculturale Guayaquil Porto delle Arti e delle Culture, Ecuador',
          '2017-2024 Mostre internazionali con Mondial Art Academia (MAA) in Costa Rica, Colombia, Spagna, Italia, Ecuador, Perù, Argentina, Svizzera, Venezuela, Panama, Turchia, India, Corea del Sud, Francia, Canada, Cuba, Australia, Danimarca',
          '2002-2019 Multiple mostre a Casa del Artista, FANAL, OUTLET MALL, e altri spazi in Costa Rica'
        ]
      }
    } else {
      return {
        individual: [
          '2017 Galileo Systems, Barreal de Heredia, Costa Rica',
          '2017 Isaac Barcat Art Gallery, Room III',
          '2015 University Book House, UNAM. Mexico DF Vitrales Hall',
          '2013 Casona de Laly, Escazú',
          '2012 School of Musical Arts, University of Costa Rica',
          '2011 Central Post Office, San José (Nov 20 - Dec 2)',
          '2010 Central Post Office, San José (Dec 20 - Jan 7)'
        ],
        duo: [
          '2019 Vice-Rectorate of Social Action, University of Costa Rica, San José, Costa Rica',
          '2018 Central Post Office, San José, Costa Rica',
          '2015 Mexican Institute, San Pedro. Painting and inauguration and presentation of the poetry book En las Mejillas del Tiempo',
          '2012 La Guaricha Cultural House, David, Chiriquí, Panama',
          '2010 Hotel El Tirol (March-December)',
          '2009 Galileo Systems - Barreal de Heredia (December)'
        ],
        collective: [
          '2022-2024 Multiple digital and in-person exhibitions in various countries',
          '2021 1st International Visual Arts Biennial, University of Panama',
          '2020 Dubai Print Festival, Museum of the Americas',
          '2019 International Contemporary Art Exhibition, Art Festival, Piazza della Repubblica, Rome, Italy',
          '2019 Guayaquil Intercultural Festival Port of Arts and Cultures, Ecuador',
          '2017-2024 International exhibitions with Mondial Art Academia (MAA) in Costa Rica, Colombia, Spain, Italy, Ecuador, Peru, Argentina, Switzerland, Venezuela, Panama, Turkey, India, South Korea, France, Canada, Cuba, Australia, Denmark',
          '2002-2019 Multiple exhibitions at Casa del Artista, FANAL, OUTLET MALL, and other spaces in Costa Rica'
        ]
      }
    }
  }

  // Only use fallback if API data is empty and not loading
  if (!loading && exhibitions.individual.length === 0) {
    const fallbackExhibitions = getExhibitions()
    exhibitions.individual = fallbackExhibitions.individual
    exhibitions.duo = fallbackExhibitions.duo
    exhibitions.collective = fallbackExhibitions.collective
  }

  const getAwards = () => {
    if (language === 'es') {
      return [
        '2025 Reconocimiento al Mérito en Poesía y Crítica en Semiótica Estética por su valiosa obra "Un need inmaterial". Academia de arte y poesía ITALIA',
        '2024 Premio a la Excelencia Creativa en Fundación Círculo de las Artes, Francia',
        '2023 Tercer lugar en poesía, en la Fundación Árboles y Vida, Heredia, Costa Rica',
        '2022 Certificado de Artista por el Museo de las Américas',
        '2022 Certificado de excelencia por ARTAVITA',
        '2022 Certificado de excelencia en el Premio de Arte Global Dr. Mostafa Sadek II. Egipto',
        '2020 Premio Internacional FRIDA KAHLO, curadores Francesco y Salvatore Russo. Italia',
        'Certificado de excelencia 2020 otorgado por ARTAVITA. EE. UU.',
        'Participación de 668 artistas a nivel mundial, en la tercera edición de la elección El Artista del año 2019',
        'Mención Honorífica 2020. Premio otorgado por FUNDACIÓN CIRCLE PARA LAS ARTES, otorgado en FRANCIA, por el cuadro "El Péndulo del Tiempo"'
      ]
    } else if (language === 'it') {
      return [
        '2025 Riconoscimento al Merito in Poesia e Critica in Semiotica Estetica per la sua preziosa opera "Un need inmaterial". Accademia di arte e poesia ITALIA',
        '2024 Premio all\'Eccellenza Creativa alla Fondazione Cerchio delle Arti, Francia',
        '2023 Terzo posto in poesia, alla Fondazione Alberi e Vita, Heredia, Costa Rica',
        '2022 Certificato di Artista dal Museo delle Americhe',
        '2022 Certificato di eccellenza da ARTAVITA',
        '2022 Certificato di eccellenza al Premio d\'Arte Globale Dr. Mostafa Sadek II. Egitto',
        '2020 Premio Internazionale FRIDA KAHLO, curatori Francesco e Salvatore Russo. Italia',
        'Certificato di eccellenza 2020 assegnato da ARTAVITA. USA',
        'Partecipazione di 668 artisti a livello mondiale, nella terza edizione della selezione L\'Artista dell\'anno 2019',
        'Menzione d\'Onore 2020. Premio assegnato dalla FONDAZIONE CERCHIO PER LE ARTI, assegnato in FRANCIA, per il dipinto "Il Pendolo del Tempo"'
      ]
    } else {
      return [
        '2025 Recognition of Merit in Poetry and Criticism in Aesthetic Semiotics for her valuable work "Un need inmaterial". Academy of Art and Poetry ITALY',
        '2024 Creative Excellence Award at Circle of Arts Foundation, France',
        '2023 Third place in poetry, at the Trees and Life Foundation, Heredia, Costa Rica',
        '2022 Artist Certificate by the Museum of the Americas',
        '2022 Certificate of Excellence by ARTAVITA',
        '2022 Certificate of Excellence in the Dr. Mostafa Sadek II Global Art Award. Egypt',
        '2020 International FRIDA KAHLO Award, curators Francesco and Salvatore Russo. Italy',
        'Certificate of Excellence 2020 awarded by ARTAVITA. USA',
        'Participation of 668 artists worldwide, in the third edition of the Artist of the Year 2019 selection',
        'Honorary Mention 2020. Award granted by CIRCLE FOUNDATION FOR THE ARTS, awarded in FRANCE, for the painting "The Pendulum of Time"'
      ]
    }
  }

  // Only use fallback if API data is empty and not loading
  if (!loading && awards.length === 0) {
    awards.push(...getAwards())
  }

  const getPublications = () => {
    if (language === 'es') {
      return [
        '2025 Publicación del libro de poesía: OTRA VEZ, VOLVIÓ A AManecer',
        '2021-2022 Múltiples ediciones de la revista digital Fusion Art World ACAM',
        '2021 Cuando la luna nos ve. Antología de poetas',
        '2017-2018 Libro Mondial Art Academia',
        '2015 Libro En las Mejillas del Tiempo, libro de poesía'
      ]
    } else if (language === 'it') {
      return [
        '2025 Pubblicazione del libro di poesie: OTRA VEZ, VOLVIÓ A AManecer',
        '2021-2022 Multiple edizioni della rivista digitale Fusion Art World ACAM',
        '2021 Quando la luna ci vede. Antologia di poeti',
        '2017-2018 Libro Mondial Art Academia',
        '2015 Libro En las Mejillas del Tiempo, libro di poesie'
      ]
    } else {
      return [
        '2025 Publication of the poetry book: OTRA VEZ, VOLVIÓ A AManecer',
        '2021-2022 Multiple editions of the digital magazine Fusion Art World ACAM',
        '2021 When the moon sees us. Poets anthology',
        '2017-2018 Mondial Art Academia Book',
        '2015 Book En las Mejillas del Tiempo, poetry book'
      ]
    }
  }

  // Only use fallback if API data is empty and not loading
  if (!loading && publications.length === 0) {
    publications.push(...getPublications())
  }

  return (
    <div className="about-page">
      <Header />
      <main className="about-main">
        <section className="about-hero">
          <h1 className="about-hero-title">{t('about.title')}</h1>
        </section>

        <section className="about-content-section">
          <div className="about-container">
            <div className="about-image-section">
              <div className="artist-image-placeholder">
                {artistPhoto ? (
                  <img src={artistPhoto} alt={getArtistInfo('name')} className="artist-photo" />
                ) : (
                  <div className="artist-initials">MQ</div>
                )}
                <div className={`artist-name-overlay ${!nameVisible ? 'show' : ''}`}>
                  <h2 className="artist-name-overlay-text">{getArtistInfo('name')}</h2>
                  <p className="artistic-name-overlay">{t('about.artisticName')}: <strong>{getArtistInfo('artistic_name')}</strong></p>
                </div>
              </div>
            </div>
            
            <div className="about-text-section">
              <h2 className="artist-name">{getArtistInfo('name')}</h2>
              <p className="artistic-name">{t('about.artisticName')}: <strong>{getArtistInfo('artistic_name')}</strong></p>
              
              <div className="artist-details">
                <div className="detail-item">
                  <span className="detail-label">{t('about.birthdate')}:</span>
                  <span className="detail-value">{getArtistInfo('birthdate')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t('about.country')}:</span>
                  <span className="detail-value">{getArtistInfo('country')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t('about.technique')}:</span>
                  <span className="detail-value">{getArtistInfo('technique')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t('about.location')}:</span>
                  <span className="detail-value">{getArtistInfo('location')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t('about.email')}:</span>
                  <span className="detail-value">
                    <a href={`mailto:${getArtistInfo('email')}`}>{getArtistInfo('email')}</a>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t('about.phone')}:</span>
                  <span className="detail-value">
                    <a 
                      href={`https://wa.me/506${getArtistInfo('phone')}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="whatsapp-link"
                      title={language === 'en' ? 'Open WhatsApp' : language === 'it' ? 'Apri WhatsApp' : 'Abrir WhatsApp'}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor"/>
                      </svg>
                      <span>+506 {getArtistInfo('phone')}</span>
                    </a>
                  </span>
                </div>
              </div>

              <div className="about-bio">
                <p>{getArtistInfo('bio')}</p>
                <blockquote className="artist-quote">
                  "{t('artist.quote')}"
                </blockquote>
              </div>

              <div className="accordion-section">
                <button 
                  className={`accordion-header ${openSections.artisticFocus ? 'active' : ''}`}
                  onClick={() => toggleSection('artisticFocus')}
                >
                  <h3 className="section-heading">{t('artist.artisticFocus.title')}</h3>
                  <span className="accordion-icon">{openSections.artisticFocus ? '−' : '+'}</span>
                </button>
                {openSections.artisticFocus && (
                  <div className="accordion-content">
                    <div className="focus-item">
                      <h4>{t('artist.artisticFocus.style1.title')}</h4>
                      <p>{t('artist.artisticFocus.style1.description')}</p>
                    </div>
                    <div className="focus-item">
                      <h4>{t('artist.artisticFocus.style2.title')}</h4>
                      <p>{t('artist.artisticFocus.style2.description')}</p>
                    </div>
                    <div className="focus-item">
                      <h4>{t('artist.artisticFocus.style3.title')}</h4>
                      <p>{t('artist.artisticFocus.style3.description')}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="accordion-section">
                <button 
                  className={`accordion-header ${openSections.exhibitions ? 'active' : ''}`}
                  onClick={() => toggleSection('exhibitions')}
                >
                  <h3 className="section-heading">{t('about.exhibitions')}</h3>
                  <span className="accordion-icon">{openSections.exhibitions ? '−' : '+'}</span>
                </button>
                {openSections.exhibitions && (
                  <div className="accordion-content">
                    <div className="exhibition-type">
                      <h4>{t('about.individual')}</h4>
                      <ul className="exhibitions-list">
                        {exhibitions.individual.length > 0 ? (
                          exhibitions.individual.map((exhibition) => (
                            <li key={exhibition.id || exhibition}>{exhibition.title || exhibition}</li>
                          ))
                        ) : (
                          <li>{t('about.noIndividualExhibitions')}</li>
                        )}
                      </ul>
                    </div>

                    <div className="exhibition-type">
                      <h4>{t('about.duo')}</h4>
                      <ul className="exhibitions-list">
                        {exhibitions.duo.length > 0 ? (
                          exhibitions.duo.map((exhibition) => (
                            <li key={exhibition.id || exhibition}>{exhibition.title || exhibition}</li>
                          ))
                        ) : (
                          <li>{t('about.noDuoExhibitions')}</li>
                        )}
                      </ul>
                    </div>

                    <div className="exhibition-type">
                      <h4>{t('about.collective')}</h4>
                      <ul className="exhibitions-list">
                        {exhibitions.collective.length > 0 ? (
                          exhibitions.collective.map((exhibition) => (
                            <li key={exhibition.id || exhibition}>{exhibition.title || exhibition}</li>
                          ))
                        ) : (
                          <li>{t('about.noCollectiveExhibitions')}</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="accordion-section">
                <button 
                  className={`accordion-header ${openSections.awards ? 'active' : ''}`}
                  onClick={() => toggleSection('awards')}
                >
                  <h3 className="section-heading">{t('about.awards')}</h3>
                  <span className="accordion-icon">{openSections.awards ? '−' : '+'}</span>
                </button>
                {openSections.awards && (
                  <div className="accordion-content">
                    <ul className="awards-list">
                      {awards.length > 0 ? (
                        awards.map((award) => (
                          <li key={award.id || award}>{award.title || award}</li>
                        ))
                      ) : (
                        <li>{t('about.noAwards')}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <div className="accordion-section">
                <button 
                  className={`accordion-header ${openSections.publications ? 'active' : ''}`}
                  onClick={() => toggleSection('publications')}
                >
                  <h3 className="section-heading">{t('about.publications')}</h3>
                  <span className="accordion-icon">{openSections.publications ? '−' : '+'}</span>
                </button>
                {openSections.publications && (
                  <div className="accordion-content">
                    <ul className="publications-list">
                      {publications.length > 0 ? (
                        publications.map((publication) => (
                          <li key={publication.id || publication}>{publication.title || publication}</li>
                        ))
                      ) : (
                        <li>{t('about.noPublications')}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <div className="accordion-section">
                <button 
                  className={`accordion-header ${openSections.upcoming ? 'active' : ''}`}
                  onClick={() => toggleSection('upcoming')}
                >
                  <h3 className="section-heading">{t('about.upcoming')}</h3>
                  <span className="accordion-icon">{openSections.upcoming ? '−' : '+'}</span>
                </button>
                {openSections.upcoming && (
                  <div className="accordion-content">
                    {upcomingEvents.length > 0 ? (
                      <ul className="upcoming-list">
                        {upcomingEvents.map((event) => (
                          <li key={event.id}>{event.title}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{t('about.noUpcomingEvents')}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default About
