import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieService, authService, subscriptionService } from '../services';
import MovieCard from '../components/MovieCard';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [hasSubscription, setHasSubscription] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkSubscriptionAndFetchMovies();
  }, []);

  const checkSubscriptionAndFetchMovies = async () => {
    try {
      setCheckingSubscription(true);
      const user = authService.getCurrentUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      // Check if user has active subscription
      const subscription = await subscriptionService.getCurrentSubscription(user.user_id);
      const hasActiveSub = subscription?.current_subscription_id > 0;
      
      setHasSubscription(hasActiveSub);

      if (hasActiveSub) {
        await fetchMovies();
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Subscription check failed:', err);
      setError('Failed to verify subscription');
      setLoading(false);
    } finally {
      setCheckingSubscription(false);
    }
  };

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await movieService.getAllMovies();
      setMovies(response.movies || []);
    } catch (err) {
      setError(err.message || 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movie.genre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !selectedGenre || movie.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const genres = [...new Set(movies.map(movie => movie.genre))];

  // Redirect to subscription if no active subscription
  if (!checkingSubscription && !hasSubscription) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎬</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Subscription Required</h2>
            <p className="text-gray-400 mb-6">
              You need an active subscription to access our movie library.
            </p>
            <button
              onClick={() => navigate('/subscription')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Choose a Plan
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || checkingSubscription) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading movies...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8">
      <div className="container  mx-auto w-11/12">
        {/* Enhanced Header */}
        <div className="mb-12 text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Movie Library
          </motion.h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Discover thousands of movies in stunning HD quality
          </p>
          
          {/* Enhanced Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search movies by title or genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 backdrop-blur-sm transition-all duration-300"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 backdrop-blur-sm transition-all duration-300"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="text-gray-400 text-sm">
            Showing {filteredMovies.length} of {movies.length} movies
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600/20 border border-red-600 text-white p-4 rounded-2xl mb-6 max-w-2xl mx-auto text-center backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {filteredMovies.map((movie, index) => (
            <MovieCard 
              key={movie.movie_id} 
              movie={movie} 
              index={index}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredMovies.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎭</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;