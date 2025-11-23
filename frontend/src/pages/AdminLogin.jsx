import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../utils/translations'
import axios from 'axios'
import './AdminLogin.css'

function AdminLogin() {
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      // Just redirect if token exists - let the dashboard validate it
      navigate('/admin/dashboard')
    }
  }, [navigate])

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('/api/v1/admin/login', credentials)
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token)
        navigate('/admin/dashboard')
      }
    } catch (error) {
      setError(error.response?.data?.error || (language === 'en' ? 'Invalid credentials' : 'Credenciales inválidas'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <h1 className="admin-login-title">{t('admin.loginTitle')}</h1>
          <p className="admin-login-subtitle">{t('admin.loginSubtitle')}</p>
          
          {error && (
            <div className="admin-error-message">
              {error}
            </div>
          )}

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">{t('admin.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{t('admin.password')}</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>

            <button 
              type="submit" 
              className="admin-login-btn"
              disabled={loading}
            >
              {loading ? (language === 'en' ? 'Logging in...' : 'Iniciando sesión...') : t('admin.login')}
            </button>
          </form>

          <div className="admin-login-footer">
            <a href="/" className="back-link">
              {t('admin.backToSite')}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin

