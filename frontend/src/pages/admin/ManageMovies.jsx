import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { movieService } from '../../services';
import { 
  Search, 
  Filter, 
  X, 
  Play, 
  Download,
  Trash2,
  Eye,
  Plus,
  Film,
  HardDrive,
  Clock,
  Tag,
  Calendar,
  AlertTriangle,
  DownloadIcon
} from 'lucide-react';

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await movieService.getAllMovies();
      setMovies(response.movies || []);
    } catch (err) {
      setError(err.message || 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (movieId) => {
    try {
      await movieService.deleteMovie(movieId);
      setMovies(movies.filter(movie => movie.movie_id !== movieId));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message || 'Failed to delete movie');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Get unique genres for filter
  const genres = [...new Set(movies.map(movie => movie.genre))].filter(Boolean);

  // Filter movies based on search and genre
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movie.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !filterGenre || movie.genre === filterGenre;
    return matchesSearch && matchesGenre;
  });

  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA0OCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjY0IiBmaWxsPSIjMUYyOTM3Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjEwIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
    e.target.onerror = null;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white text-xl font-light"
          >
            Loading movies...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8 pt-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8"
        >
          <div className="mb-6 lg:mb-0">
            <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Manage Movies
            </h1>
            <p className="text-gray-400 text-lg">View, edit, and remove movies from your library</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/admin/add-movie"
              className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-2xl transition-all duration-200"
            >
              <Plus size={20} />
              <span>Add New Movie</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { icon: Film, label: 'Total Movies', value: movies.length, color: 'from-blue-500 to-cyan-500' },
            { icon: HardDrive, label: 'Total Storage', value: `${(movies.reduce((sum, movie) => sum + (movie.file_size || 0), 0) / (1024 * 1024 * 1024)).toFixed(1)} GB`, color: 'from-green-500 to-emerald-500' },
            { icon: Clock, label: 'Avg Duration', value: formatDuration(Math.round(movies.reduce((sum, movie) => sum + (movie.duration || 0), 0) / movies.length)), color: 'from-purple-500 to-pink-500' },
            { icon: Tag, label: 'Genres', value: genres.length, color: 'from-yellow-500 to-orange-500' },
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className={`bg-gradient-to-r ${stat.color} rounded-2xl p-6 text-white shadow-2xl border border-white/10`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <IconComponent size={24} className="text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-600/20 border border-red-500/50 text-red-400 p-4 rounded-2xl mb-6 flex items-center space-x-3"
            >
              <AlertTriangle size={20} />
              <span className="font-medium">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 mb-6 border border-gray-700/50 shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white mb-3 font-medium flex items-center">
                <Search size={16} className="mr-2" />
                Search Movies
              </label>
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-white mb-3 font-medium flex items-center">
                <Filter size={16} className="mr-2" />
                Filter by Genre
              </label>
              <select
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <motion.button
                onClick={() => {
                  setSearchTerm('');
                  setFilterGenre('');
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-xl transition-all duration-200 border border-gray-500/50 flex items-center justify-center space-x-2"
              >
                <X size={16} />
                <span>Clear Filters</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Movies Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Film className="mr-3" size={24} />
            Movie Library ({filteredMovies.length} movies)
          </h2>

          {filteredMovies.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Film size={64} className="text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-xl mb-2">
                {movies.length === 0 ? 'No movies found' : 'No movies match your search'}
              </p>
              <p className="text-gray-500 text-sm mb-4">
                {movies.length === 0 
                  ? 'Get started by adding your first movie' 
                  : 'Try adjusting your search criteria'
                }
              </p>
              {movies.length === 0 && (
                <Link
                  to="/admin/add-movie"
                  className="text-red-400 hover:text-red-300 font-semibold flex items-center justify-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Add your first movie</span>
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMovies.map((movie, index) => (
                <motion.div
                  key={movie.movie_id}
                  variants={itemVariants}
                  className="bg-gray-700/30 rounded-2xl p-4 border border-gray-600/50 hover:border-red-500/50 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="flex space-x-4">
                    <img
                      src={movieService.getThumbnailUrl(movie.movie_id)}
                      alt={movie.title}
                      className="w-20 h-28 object-cover rounded-xl"
                      onError={handleImageError}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                        {movie.title}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Tag size={14} />
                          <span className="bg-gray-600 px-2 py-1 rounded text-xs">
                            {movie.genre}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Calendar size={14} />
                          <span>{movie.release_year}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Clock size={14} />
                          <span>{formatDuration(movie.duration)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <HardDrive size={14} />
                          <span>{formatFileSize(movie.file_size)}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <motion.button
                          onClick={() => window.open(movieService.getStreamUrl(movie.movie_id), '_blank')}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 flex-1 justify-center"
                          title="Download"
                        >
                          <DownloadIcon size={16} />
                          <span>Download</span>
                        </motion.button>
                        
                        <motion.button
                          onClick={() => window.open(`/movie/${movie.movie_id}/play`, '_blank')}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 flex-1 justify-center"
                          title="Open in Player"
                        >
                          <Play size={16} />
                          <span>Play</span>
                        </motion.button>
                        
                        <motion.button
                          onClick={() => setDeleteConfirm(movie.movie_id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200"
                          title="Delete Movie"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gray-800/95 backdrop-blur-md rounded-2xl p-6 max-w-md w-full border border-gray-700/50 shadow-2xl"
              >
                <h3 className="text-white text-xl font-bold mb-4 flex items-center">
                  <AlertTriangle className="mr-3 text-red-400" size={24} />
                  Confirm Delete
                </h3>
                <p className="text-gray-400 mb-6">
                  Are you sure you want to delete this movie? This action cannot be undone and will permanently remove the movie file and all associated data.
                </p>
                <div className="flex space-x-4">
                  <motion.button
                    onClick={() => handleDelete(deleteConfirm)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex-1 font-semibold"
                  >
                    Delete Movie
                  </motion.button>
                  <motion.button
                    onClick={() => setDeleteConfirm(null)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex-1 font-semibold border border-gray-500/50"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ManageMovies;