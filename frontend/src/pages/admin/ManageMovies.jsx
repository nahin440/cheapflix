import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../../services';

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

  // Handle image error with proper fallback
  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA0OCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjY0IiBmaWxsPSIjMUYyOTM3Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjEwIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
    e.target.onerror = null; // Prevent infinite loop
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading movies...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Manage Movies</h1>
            <p className="text-gray-400">View, edit, and remove movies from your library</p>
          </div>
          <Link
            to="/admin/add-movie"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Movie
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-400 text-sm">Total Movies</p>
            <p className="text-white text-3xl font-bold">{movies.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-400 text-sm">Total Storage</p>
            <p className="text-white text-3xl font-bold">
              {(movies.reduce((sum, movie) => sum + (movie.file_size || 0), 0) / (1024 * 1024 * 1024)).toFixed(1)} GB
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-400 text-sm">Average Duration</p>
            <p className="text-white text-3xl font-bold">
              {formatDuration(Math.round(movies.reduce((sum, movie) => sum + (movie.duration || 0), 0) / movies.length))}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-400 text-sm">Genres</p>
            <p className="text-white text-3xl font-bold">{genres.length}</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Search Movies</label>
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Filter by Genre</label>
              <select
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterGenre('');
                }}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Movies Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">Movie</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Genre</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Year</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Duration</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">File Size</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Added</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredMovies.map(movie => (
                  <tr key={movie.movie_id} className="hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={movieService.getThumbnailUrl(movie.movie_id)}
                          alt={movie.title}
                          className="w-12 h-16 object-cover rounded mr-4"
                          onError={handleImageError}
                        />
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate">{movie.title}</p>
                          <p className="text-gray-400 text-sm truncate">
                            {movie.description || 'No description available'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-700 text-white px-2 py-1 rounded text-xs">
                        {movie.genre}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white">{movie.release_year}</td>
                    <td className="px-6 py-4 text-white">{formatDuration(movie.duration)}</td>
                    <td className="px-6 py-4 text-white">{formatFileSize(movie.file_size)}</td>
                    <td className="px-6 py-4 text-white text-sm">
                      {new Date(movie.added_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(movieService.getStreamUrl(movie.movie_id), '_blank')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center"
                          title="Play Movie"
                        >
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                          Play
                        </button>
                        <Link
                          to={`/movie/${movie.movie_id}/play`}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center"
                          title="Open in Player"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          Player
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(movie.movie_id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center"
                          title="Delete Movie"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredMovies.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🎬</div>
              <p className="text-gray-400 text-lg mb-2">
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
                  className="text-red-500 hover:text-red-400 font-semibold"
                >
                  Add your first movie
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Pagination Info */}
        <div className="flex justify-between items-center mt-4 text-gray-400 text-sm">
          <div>
            Showing {filteredMovies.length} of {movies.length} movies
          </div>
          <div>
            {genres.length} genres • {formatFileSize(movies.reduce((sum, movie) => sum + (movie.file_size || 0), 0))} total storage
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-white text-xl font-bold mb-4">Confirm Delete</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete this movie? This action cannot be undone and will permanently remove the movie file and all associated data.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition-colors flex-1"
                >
                  Delete Movie
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition-colors flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageMovies;