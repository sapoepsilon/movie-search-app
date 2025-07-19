const BASE_URL = '/admin'

const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`)
  }
  
  const data = await response.json()
  return data.value || data
}

const createAuthHeaders = (apiKey) => ({
  'Content-Type': 'application/json',
  'x-api-key': apiKey
})

export const adminApi = {
  // Movie CRUD operations
  movies: {
    list: async (apiKey, params = {}) => {
      try {
        const queryParams = new URLSearchParams()
        if (params.search) queryParams.append('$search', params.search)
        if (params.top) queryParams.append('$top', params.top)
        if (params.skip) queryParams.append('$skip', params.skip)
        
        const url = `${BASE_URL}/Movies${queryParams.toString() ? '?' + queryParams.toString() : ''}`
        const response = await fetch(url, {
          headers: createAuthHeaders(apiKey)
        })
        return await handleApiResponse(response)
      } catch (error) {
        throw new Error(`Failed to fetch movies: ${error.message}`)
      }
    },

    get: async (apiKey, id) => {
      try {
        const response = await fetch(`${BASE_URL}/Movies(${id})`, {
          headers: createAuthHeaders(apiKey)
        })
        return await handleApiResponse(response)
      } catch (error) {
        throw new Error(`Failed to fetch movie: ${error.message}`)
      }
    },

    create: async (apiKey, movieData) => {
      try {
        const response = await fetch(`${BASE_URL}/Movies`, {
          method: 'POST',
          headers: createAuthHeaders(apiKey),
          body: JSON.stringify(movieData)
        })
        return await handleApiResponse(response)
      } catch (error) {
        throw new Error(`Failed to create movie: ${error.message}`)
      }
    },

    update: async (apiKey, id, movieData) => {
      try {
        const response = await fetch(`${BASE_URL}/Movies(${id})`, {
          method: 'PATCH',
          headers: createAuthHeaders(apiKey),
          body: JSON.stringify(movieData)
        })
        return await handleApiResponse(response)
      } catch (error) {
        throw new Error(`Failed to update movie: ${error.message}`)
      }
    },

    delete: async (apiKey, id) => {
      try {
        const response = await fetch(`${BASE_URL}/Movies(${id})`, {
          method: 'DELETE',
          headers: createAuthHeaders(apiKey)
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return { success: true }
      } catch (error) {
        throw new Error(`Failed to delete movie: ${error.message}`)
      }
    },

    batchImport: async (apiKey, movies) => {
      try {
        const response = await fetch(`${BASE_URL}/importMovies`, {
          method: 'POST',
          headers: createAuthHeaders(apiKey),
          body: JSON.stringify({ movies })
        })
        return await handleApiResponse(response)
      } catch (error) {
        throw new Error(`Failed to import movies: ${error.message}`)
      }
    }
  },

  // Utility functions
  validateApiKey: async (apiKey) => {
    try {
      const response = await fetch(`${BASE_URL}/Movies?$top=1`, {
        headers: createAuthHeaders(apiKey)
      })
      return response.ok
    } catch (error) {
      return false
    }
  }
}

export default adminApi