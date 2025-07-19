const BASE_URL = '/api/Movies'

const handleApiResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  const data = await response.json()
  return data.value?.[0] || data
}

export const searchMovies = async (searchTerm, page = 1, type = null) => {
  try {
    const params = new URLSearchParams({
      s: searchTerm,
      page: page.toString()
    })
    
    if (type) {
      params.append('type', type)
    }
    
    const response = await fetch(`${BASE_URL}?${params}`)
    return await handleApiResponse(response)
  } catch (error) {
    return {
      Response: 'False',
      Error: 'Network error occurred'
    }
  }
}

export const getMovieById = async (imdbID) => {
  try {
    const response = await fetch(`${BASE_URL}?i=${imdbID}`)
    return await handleApiResponse(response)
  } catch (error) {
    return {
      Response: 'False',
      Error: 'Network error occurred'
    }
  }
}