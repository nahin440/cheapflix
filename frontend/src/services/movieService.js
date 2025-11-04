import api from './api';

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

  // Upload movie - FIXED THIS LINE
  async uploadMovie(formData) {
    try {
      const response = await api.post('/movies', formData, { // CHANGED FROM '/movies/upload' to '/movies'
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload movie' };
    }
  },

  // Delete movie
  async deleteMovie(movieId) {
    try {
      const response = await api.delete(`/movies/${movieId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete movie' };
    }
  },

  // Stream movie URL
  getStreamUrl(movieId) {
    return `${API_BASE_URL}/movies/${movieId}/stream`;
  },

  // Get thumbnail URL
  getThumbnailUrl(movieId) {
    return `${API_BASE_URL}/movies/${movieId}/thumbnail`;
  }
};