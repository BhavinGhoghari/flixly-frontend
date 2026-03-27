# 📺 Flixly Frontend — React OTT Interface

A premium, high-fidelity OTT streaming discovery interface built with React and Ant Design. It features cinematic carousels, a comprehensive movie/series library, and a full-featured admin dashboard.

## 🛠️ Tech Stack
- **Library:** React 18
- **Styling:** Vanilla CSS + Ant Design 5 (Dark Theme)
- **Routing:** React Router v6
- **Icons:** Ant Design Icons
- **API Client:** Axios

## ✨ Key Features
- **Premium OTT UI:** High-performance horizontal carousels with navigation arrows on the homepage.
- **Cinematic Hero:** 85vh spotlight with glassmorphism buttons and smooth backdrop transitions.
- **Smart Browsing:** Hybrid layout system (Carousels for Home, Grids for Movies/Series pages).
- **Rich Details:** IMDB-style detail pages with trailers, cast profiles, and user reviews.
- **Admin Suite:** Dashboard for managing the local library and importing titles directly from TMDB.
- **Full Responsiveness:** Optimized for Mobile, Tablet, and Desktop.

## ⚙️ Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configuration
The frontend is configured to proxy API requests to `http://localhost:5000` via `package.json`.

### 3. Run Application
```bash
npm start
```
The app will run on `http://localhost:3000`.

## 📁 Source Structure
- `/src/pages/user`: Public consumer pages (Home, Movies, Series, Actor, Details).
- `/src/pages/admin`: Internal management pages.
- `/src/components`: Reusable UI elements (TMDBMovieCard, TrailerModal, Layouts).
- `/src/utils`: Contains `api.js` with centralized `tmdb` helper methods.
- `/src/App.css`: Master stylesheet containing the OTT design system.

## 🎨 Design System
- **Background:** `#0f0f0f` (Rich Black)
- **Primary:** `#e50914` (Flixly Red)
- **Typography:** *Bebas Neue* (Headlines), *Montserrat* (Body)
