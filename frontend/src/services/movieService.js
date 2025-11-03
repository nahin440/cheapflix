import api from './api';

// Simple configuration
const API_BASE_URL = 'http://localhost:5000/api';

export const movieService = {
  // Get all movies
  async getAllMovies() {
    try {
      const response = await api.get('/movies');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch movies' };
    }
  },

  // Get single movie
  async getMovie(movieId) {
    try {
      const response = await api.get(`/movies/${movieId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch movie' };
    }
  },

  // Get recent movies
  async getRecentMovies() {
    try {
      const response = await api.get('/movies');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch recent movies' };
    }
  },

  // Download movie
  async downloadMovie(movieId, userId) {
    try {
      const response = await api.post('/downloads', {
        movie_id: movieId,
        user_id: userId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to download movie' };
    }
  },

  // Stream movie URL
  getStreamUrl(movieId) {
    return `${API_BASE_URL}/movies/${movieId}/stream`;
  },

  // Get thumbnail URL
  getThumbnailUrl(movieId) {
    return `${API_BASE_URL}/movies/${movieId}/thumbnail`;
  },

  // Search movies
  async searchMovies(query, genre, year) {
    try {
      const response = await api.get('/movies');
      let movies = response.data.movies || [];
      
      // Apply filters
      if (query) {
        movies = movies.filter(movie => 
          movie.title.toLowerCase().includes(query.toLowerCase()) ||
          (movie.description && movie.description.toLowerCase().includes(query.toLowerCase()))
        );
      }
      if (genre) {
        movies = movies.filter(movie => movie.genre === genre);
      }
      if (year) {
        movies = movies.filter(movie => movie.release_year == year);
      }
      
      return { success: true, movies };
    } catch (error) {
      throw error.response?.data || { message: 'Failed to search movies' };
    }
  },

  // Upload movie (admin only)
  async uploadMovie(formData) {
    try {
      const response = await api.post('/movies/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload movie' };
    }
  },

  // Delete movie (admin only)
  async deleteMovie(movieId) {
    try {
      const response = await api.delete(`/movies/${movieId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete movie' };
    }
  },

  // Get movie genres
  async getGenres() {
    try {
      const response = await api.get('/movies');
      const movies = response.data.movies || [];
      const genres = [...new Set(movies.map(movie => movie.genre))].filter(genre => genre);
      return { success: true, genres };
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch genres' };
    }
  },

  // Get movie by genre
  async getMoviesByGenre(genre) {
    try {
      const response = await api.get('/movies');
      const movies = response.data.movies || [];
      const filteredMovies = movies.filter(movie => movie.genre === genre);
      return { success: true, movies: filteredMovies };
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch movies by genre' };
    }
  },

  // Get popular movies
  async getPopularMovies() {
    try {
      const response = await api.get('/movies');
      const movies = response.data.movies || [];
      const popularMovies = movies.slice(0, 10);
      return { success: true, movies: popularMovies };
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch popular movies' };
    }
  },

  // Get featured movies
  async getFeaturedMovies() {
    try {
      const response = await api.get('/movies');
      const movies = response.data.movies || [];
      const featuredMovies = movies.slice(0, 5);
      return { success: true, movies: featuredMovies };
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch featured movies' };
    }
  }
};