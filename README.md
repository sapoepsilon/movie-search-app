# Movie Search App

A full-stack movie search application with admin panel built using SAP CAP (Cloud Application Programming) backend and React frontend.

## Quick Start

<details>
<summary><strong>🚀 Backend Setup</strong></summary>

```bash
cd backend
npm install
npm start
```

Backend runs on: http://localhost:4004
- Public API: http://localhost:4004/api
- Admin API: http://localhost:4004/admin (requires API key)

</details>

<details>
<summary><strong>⚛️ Frontend Setup</strong></summary>

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173 (or next available port)

**Note**: Vite proxy configured for `/api` and `/admin` routes to backend

</details>

<details>
<summary><strong>🔑 Admin Access</strong></summary>

Navigate to http://localhost:5173/admin/login and use any of these API keys:
- `dev-admin-key-123`
- `test-key-456`
- `admin-key-789`

</details>

## Features

- **Public Search**: Search through 1,600+ movies with real IMDB data
- **Admin Panel**: Full CRUD operations for movie management
  - Dashboard with movie statistics
  - Movie table with search, edit, and delete
  - Add/Edit movie form with validation
  - Real-time API integration
- **Authentication**: Server-side API key validation
- **Responsive**: Works on desktop and mobile

## Development Process

<details>
<summary><strong>📋 TDD Approach</strong></summary>

Write CRUD tests for backend → Implement features → Test functionality → Next requirement

Used SAP CAP's built-in `cds.test` framework for comprehensive backend testing with 44/46 tests passing.

</details>

<details>
<summary><strong>🏗️ Backend Architecture</strong></summary>

- **SAP CAP Framework**: Enterprise-grade Node.js framework
- **OData Compatible**: RESTful APIs with SAP standards
- **SQLite Database**: In-memory for testing, file-based for production
- **Custom Auth Middleware**: API key validation with role-based access
- **Proxy Configuration**: Vite development proxy for seamless frontend-backend communication

</details>

<details>
<summary><strong>🔐 Authentication Strategy</strong></summary>

Simple server-side API keys stored in environment variables. Could be enhanced with OAuth/JWT for production, but kept minimal per requirements.

</details>

<details>
<summary><strong>🎬 Mock Data Journey</strong></summary>

Real movie data from [MovieLens Posters](https://github.com/babu-thomas/movielens-posters):

**Data Processing:**
1. Downloaded 3 source files:
   - `movie_url.csv` - IMDB URLs for each movie
   - `movie_poster.csv` - Poster image URLs  
   - `u.item.txt` - Movie metadata (title, year, genres)

2. Extracted and processed:
   - 1,640 real IMDB IDs from URLs (format: tt0114709)
   - 1,592 working poster URLs from Amazon Images
   - Movie titles, years, and genres from metadata
   - Generated UUIDs for each record

3. Created final CSV with OMDB-compatible fields:
   - Real IMDB IDs and working poster URLs
   - Movie titles and years (1995-1998 era)
   - Proper genre classification (Action, Comedy, Drama, etc.)
   - Generated plot descriptions and search terms

**Output:** `backend/db/data/sap.capire.movies-Movies.csv`

</details>

<details>
<summary><strong>🧪 Running Tests</strong></summary>

```bash
cd backend
npm test
```

Tests cover:
- Movie search functionality
- Admin CRUD operations
- API key authentication
- Data validation

</details>

## Tech Stack

**Backend**: SAP CAP, Node.js, SQLite, Express  
**Frontend**: React 19, React Router v7, Tailwind CSS v4, shadcn/ui  
**Testing**: Vitest, SAP CAP Test Framework