# Movie Search App API Examples

## Overview
The movie search app now supports API key authentication for admin operations while keeping public search functionality available without authentication.

## Environment Setup
Set the API keys in your environment:
```bash
export API_KEYS="dev-admin-key-123,test-key-456,admin-key-789"
```

## Public API (No Authentication Required)

### Search Movies
```bash
# Search for movies containing "toy"
curl "http://localhost:4004/api/Movies?s=toy"

# Search with pagination
curl "http://localhost:4004/api/Movies?s=1995&page=1"

# Search with type filter
curl "http://localhost:4004/api/Movies?s=toy&type=movie"

# Get specific movie by IMDB ID
curl "http://localhost:4004/api/Movies?i=tt0114709"
```

## Admin API (Requires API Key)

### Authentication
All admin operations require the `x-api-key` header:
```bash
ADMIN_KEY="dev-admin-key-123"
```

### List All Movies (Admin View)
```bash
curl -H "x-api-key: $ADMIN_KEY" \
  "http://localhost:4004/admin/Movies"
```

### Create New Movie
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: $ADMIN_KEY" \
  -d '{
    "imdbID": "tt9999999",
    "Title": "Test Movie",
    "Year": "2024",
    "Type": "movie",
    "Plot": "A test movie for demonstration",
    "Director": "Test Director",
    "Actors": "Actor One, Actor Two",
    "Genre": "Action, Drama",
    "Runtime": "120 min",
    "Rated": "PG-13",
    "Released": "01 Jan 2024",
    "imdbRating": "8.5",
    "Poster": "https://example.com/poster.jpg"
  }' \
  "http://localhost:4004/admin/Movies"
```

### Update Movie
```bash
curl -X PATCH \
  -H "Content-Type: application/json" \
  -H "x-api-key: $ADMIN_KEY" \
  -d '{
    "Title": "Updated Movie Title",
    "Year": "2025"
  }' \
  "http://localhost:4004/admin/Movies(MOVIE_ID_HERE)"
```

### Delete Movie
```bash
curl -X DELETE \
  -H "x-api-key: $ADMIN_KEY" \
  "http://localhost:4004/admin/Movies(MOVIE_ID_HERE)"
```

### Batch Import Movies
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: $ADMIN_KEY" \
  -d '{
    "movies": [
      {
        "imdbID": "tt1111111",
        "Title": "Batch Movie 1",
        "Year": "2024",
        "Type": "movie",
        "Plot": "First batch movie"
      },
      {
        "imdbID": "tt2222222",
        "Title": "Batch Movie 2",
        "Year": "2024",
        "Type": "series",
        "Plot": "Second batch movie"
      }
    ]
  }' \
  "http://localhost:4004/admin/importMovies"
```

## Error Responses

### 401 - Unauthorized (Missing or Invalid API Key)
```bash
# Without API key
curl "http://localhost:4004/admin/Movies"

# With invalid API key
curl -H "x-api-key: invalid-key" \
  "http://localhost:4004/admin/Movies"
```

### 400 - Bad Request (Missing Required Fields)
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: $ADMIN_KEY" \
  -d '{"Title": "Missing IMDB ID"}' \
  "http://localhost:4004/admin/Movies"
```

### 409 - Conflict (Duplicate IMDB ID)
```bash
# Try to create movie with existing IMDB ID
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: $ADMIN_KEY" \
  -d '{
    "imdbID": "tt0114709",
    "Title": "Duplicate Movie"
  }' \
  "http://localhost:4004/admin/Movies"
```

## API Key Management

### Valid API Keys
The server accepts any of the comma-separated keys from the `API_KEYS` environment variable:
- `dev-admin-key-123`
- `test-key-456` 
- `admin-key-789`

### Security Features
- Server-side static API keys (no database dependency)
- Case-insensitive header handling (`x-api-key` or `X-API-KEY`)
- Automatic search term generation for created/updated movies
- Input validation and duplicate detection
- Comprehensive error handling

## Testing
Run the test suite to verify all functionality:
```bash
npm test
```

Tests cover:
- ✅ Public API access without authentication
- ✅ Admin API authentication with valid/invalid keys
- ✅ CRUD operations for movies
- ✅ Batch import functionality
- ✅ Data validation and error handling
- ✅ Search term generation