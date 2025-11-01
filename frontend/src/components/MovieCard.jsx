import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieService, authService } from '../services';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const user = authService.getCurrentUser();

  const handlePlay = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/movie/${movie.movie_id}/play`);
  };

  const handleDownload = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!user.can_download) {
      alert('Download feature is not available with your current subscription. Please upgrade to Level 2 or higher.');
      return;
    }

    try {
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = movieService.getStreamUrl(movie.movie_id);
      link.download = `${movie.title}${movie.file_url ? movie.file_url.substring(movie.file_url.lastIndexOf('.')) : '.mp4'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Record download in backend
      await movieService.downloadMovie(movie.movie_id, user.user_id);
      
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  // Handle image error with SVG fallback
  const handleImageError = () => {
    setImageError(true);
  };

  // Get thumbnail URL with fallback
  const getThumbnailUrl = () => {
    if (imageError) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjMUYyOTM3Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0Ij5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
    }
    return movieService.getThumbnailUrl(movie.movie_id);
  };

  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail Container */}
      <div className="relative overflow-hidden">
        <img
          src={getThumbnailUrl()}
          alt={movie.title}
          className="w-full h-64 object-cover transition-transform duration-300"
          onError={handleImageError}
        />
        
        {/* Overlay with Actions */}
        <div className={`absolute inset-0 bg-black bg-opacity-60 transition-opacity duration-300 flex items-center justify-center ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex space-x-3">
            <button
              onClick={handlePlay}
              className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
              title="Play Movie"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
            
            {user?.can_download && (
              <button
                onClick={handleDownload}
                className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
                title="Download Movie"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Quality Badge */}
        <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-80 text-white px-2 py-1 rounded text-xs font-semibold">
          HD
        </div>

        {/* Duration Badge */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          {movie.duration}min
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="text-white font-bold text-lg mb-2 line-clamp-1 hover:text-red-400 transition-colors cursor-pointer">
          {movie.title}
        </h3>
        
        <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
          <span className="bg-gray-700 px-2 py-1 rounded">{movie.genre}</span>
          <span>{movie.release_year}</span>
        </div>

        <p className="text-gray-400 text-sm line-clamp-2 mb-3 leading-relaxed">
          {movie.description || 'No description available.'}
        </p>

        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Added: {new Date(movie.added_at).toLocaleDateString()}</span>
          {movie.file_size && (
            <span>{(movie.file_size / (1024 * 1024)).toFixed(1)} MB</span>
          )}
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className={`px-4 py-3 bg-gray-750 border-t border-gray-700 transition-all duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0 h-0 py-0'
      }`}>
        <div className="flex justify-between items-center text-sm">
          <button
            onClick={handlePlay}
            className="text-red-400 hover:text-red-300 font-semibold flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Play
          </button>
          
          {user?.can_download && (
            <button
              onClick={handleDownload}
              className="text-gray-400 hover:text-white flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;