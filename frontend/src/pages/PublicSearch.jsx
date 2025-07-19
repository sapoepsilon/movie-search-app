import { useState, useCallback } from 'react'
import SearchBox from '../components/SearchBox'
import SearchInfo from '../components/SearchInfo'
import FilterControls from '../components/FilterControls'
import MovieList from '../components/MovieList'
import Pagination from '../components/Pagination'
import { searchMovies } from '../services/movieApi'

function PublicSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [movies, setMovies] = useState([])
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedType, setSelectedType] = useState('')

  const handleSearch = useCallback(async (term, page = 1, type = selectedType) => {
    if (!term?.trim()) return

    setLoading(true)
    setError(null)
    setSearchTerm(term)
    setCurrentPage(page)

    try {
      const result = await searchMovies(term, page, type)
      
      if (result.Response === 'True') {
        setMovies(result.Search || [])
        setTotalResults(parseInt(result.totalResults) || 0)
      } else {
        setMovies([])
        setTotalResults(0)
        setError(result.Error || 'Search failed')
      }
    } catch (err) {
      setError('Network error occurred')
      setMovies([])
      setTotalResults(0)
    } finally {
      setLoading(false)
    }
  }, [selectedType])

  const handlePageChange = useCallback((page) => {
    if (searchTerm) {
      handleSearch(searchTerm, page)
    }
  }, [searchTerm, handleSearch])

  const handleTypeChange = useCallback((type) => {
    setSelectedType(type)
    if (searchTerm) {
      handleSearch(searchTerm, 1, type)
    }
  }, [searchTerm, handleSearch])

  return (
    <main role="main" className="container mx-auto px-4 py-8 flex-1 flex flex-col">
      <div data-testid="search-container" className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          <div className="flex-1">
            <SearchBox onSearch={handleSearch} loading={loading} />
          </div>
          {(searchTerm || loading) && (
            <div className="md:w-48">
              <FilterControls
                selectedType={selectedType}
                onTypeChange={handleTypeChange}
              />
            </div>
          )}
        </div>
      </div>

      {(searchTerm || loading) && (
        <div className="mb-6">
          <SearchInfo 
            searchTerm={searchTerm}
            totalResults={totalResults}
            currentPage={currentPage}
            loading={loading}
          />
        </div>
      )}
      
      <div data-testid="movie-list-container" className="flex-1">
        <MovieList 
          movies={movies}
          loading={loading}
          error={error}
        />
      </div>

      {totalResults > 10 && !loading && !error && (
        <div className="mt-auto pt-8">
          <Pagination
            currentPage={currentPage}
            totalResults={totalResults}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </main>
  )
}

export default PublicSearch