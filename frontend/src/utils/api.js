// API configuration utility
// In development, uses proxy from vite.config.js
// In production, uses VITE_API_URL environment variable or falls back to relative paths

const getApiBaseUrl = () => {
  // In production, use environment variable if set
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // In development, use relative path (Vite proxy handles it)
  // In production (Vercel), use relative path (Vercel rewrites handle it)
  return ''
}

export const API_BASE_URL = getApiBaseUrl()

// Helper function to make API calls
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
}

