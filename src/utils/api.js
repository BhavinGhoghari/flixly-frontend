import axios from "axios";

const API = axios.create({
  baseURL: (process.env.REACT_APP_API_URL || "") + "/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("flixly_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const tmdb = {
  // Browse
  getPopularMovies: (page = 1) => API.get(`/tmdb/movies/popular?page=${page}`),
  getTopRatedMovies: (page = 1) =>
    API.get(`/tmdb/movies/top_rated?page=${page}`),
  getUpcomingMovies: (page = 1) =>
    API.get(`/tmdb/movies/upcoming?page=${page}`),
  getUpcoming: (page = 1) => API.get(`/tmdb/movies/upcoming?page=${page}`),
  getNowPlaying: (page = 1) => API.get(`/tmdb/movies/now_playing?page=${page}`),
  getPopularSeries: (page = 1) => API.get(`/tmdb/series/popular?page=${page}`),
  getTopRatedSeries: (page = 1) =>
    API.get(`/tmdb/series/top_rated?page=${page}`),
  getOnTheAir: (page = 1) => API.get(`/tmdb/series/on_the_air?page=${page}`),
  getTrending: (w = "week") => API.get(`/tmdb/trending?window=${w}`),

  // Details (rich — includes full cast with images, watch providers)
  getMovieDetail: (id) => API.get(`/tmdb/movie/${id}`),
  getSeriesDetail: (id) => API.get(`/tmdb/series/${id}`),

  // Full cast + crew for a title
  getFullCast: (mediaType, id) => API.get(`/tmdb/cast/${mediaType}/${id}`),

  // Actor/person profile + filmography
  getActor: (id) => API.get(`/tmdb/actor/${id}`),

  // Search
  search: (query, page = 1, type = "all") =>
    API.get(
      `/tmdb/search?query=${encodeURIComponent(query)}&page=${page}&type=${type}`,
    ),

  // Discover
  discoverMovies: (params = {}) =>
    API.get(`/tmdb/discover/movie?${new URLSearchParams(params)}`),
  discoverTV: (params = {}) =>
    API.get(`/tmdb/discover/tv?${new URLSearchParams(params)}`),
  getMoviesByGenre: (genreId, page = 1) =>
    API.get(`/tmdb/discover/movie?genre=${genreId}&page=${page}`),

  // Genres
  getMovieGenres: () => API.get("/tmdb/genres/movie"),
  getTVGenres: () => API.get("/tmdb/genres/tv"),

  // Admin import
  importTitle: (tmdbId, mediaType) =>
    API.post("/tmdb/import", { tmdbId, mediaType }),
};

export default API;
