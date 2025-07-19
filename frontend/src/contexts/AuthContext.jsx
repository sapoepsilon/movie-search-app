import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedApiKey = localStorage.getItem('admin-api-key')
    if (savedApiKey) {
      setApiKey(savedApiKey)
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const validateApiKey = async (key) => {
    try {
      const response = await fetch('/admin/Movies', {
        method: 'GET',
        headers: {
          'x-api-key': key,
          'Content-Type': 'application/json'
        }
      })
      return response.ok
    } catch (error) {
      return false
    }
  }

  const login = async (key) => {
    if (!key?.trim()) {
      return { success: false, error: 'API key is required' }
    }

    setIsLoading(true)
    try {
      const isValid = await validateApiKey(key)
      if (isValid) {
        localStorage.setItem('admin-api-key', key)
        setApiKey(key)
        setIsAuthenticated(true)
        return { success: true }
      } else {
        return { success: false, error: 'Invalid API key' }
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('admin-api-key')
    setApiKey(null)
    setIsAuthenticated(false)
  }

  const value = {
    apiKey,
    isAuthenticated,
    isLoading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext