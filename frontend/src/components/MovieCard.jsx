import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { movieService, authService } from '../services';
import { Play, Download, Info, Star, Lock } from 'lucide-react';

const MovieCard = ({ movie, index, onCardClick, showPlayButton = true }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const user = authService.getCurrentUser();

  const handlePlay = (e) => {
    e.stopPropagation(); // Prevent triggering card click
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/movie/${movie.movie_id}/play`);
  };

  const handleDownload = async (e) => {
    e.stopPropagation(); // Prevent triggering card click
    if (!user) {
      navigate('/login');
      return;
    }

    if (!user.can_download) {
      alert('Download feature requires Level 2 or higher subscription');
      navigate('/subscription');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = movieService.getStreamUrl(movie.movie_id);
      link.download = `${movie.title}${movie.file_url ? movie.file_url.substring(movie.file_url.lastIndexOf('.')) : '.mp4'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      await movieService.downloadMovie(movie.movie_id, user.user_id);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const handleDownloadBlocked = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    alert('Download feature requires Level 2 or higher subscription');
    navigate('/subscription');
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick();
    } else {
      // Default behavior if no custom click handler
      if (!user) {
        navigate('/login');
        return;
      }
      navigate(`/movie/${movie.movie_id}`);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getThumbnailUrl = () => {
    if (imageError) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjMTcxODIyIi8+CjxwYXRoIGQ9Ik0xMjAgMjAwTDE4MCAyNTBMMTIwIDMwMFYyMDBaIiBmaWxsPSIjNkI3MjgwIi8+Cjwvc3ZnPg==';
    }
    return movieService.getThumbnailUrl(movie.movie_id);
  };

  const canDownload = user?.can_download;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="bg-gray-800/30 rounded-2xl overflow-hidden border border-gray-700/50 backdrop-blur-sm transition-all duration-500 hover:border-red-500/50 hover:bg-gray-800/50 hover:shadow-2xl hover:shadow-red-500/10">
        
        {/* Thumbnail Container */}
        <div className="relative overflow-hidden aspect-[2/3]">
          <motion.img
            src={getThumbnailUrl()}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={handleImageError}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
          
          {/* Top Info */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <div className="bg-black/70 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
              {movie.duration}min
            </div>
            <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold backdrop-blur-sm">
              HD
            </div>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-black/50 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm inline-block">
              {movie.genre}
            </div>
          </div>

          {/* Hover Actions */}
          <motion.div
            className="absolute inset-0 bg-black/70 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex gap-3">
              {showPlayButton && (
                <motion.button
                  onClick={handlePlay}
                  className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-2xl"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Play size={24} />
                </motion.button>
              )}
              
              {/* Download Button - Show for all users but with different states */}
              {showPlayButton && (
                <motion.button
                  onClick={canDownload ? handleDownload : handleDownloadBlocked}
                  className={`p-4 rounded-full shadow-2xl backdrop-blur-sm ${
                    canDownload 
                      ? 'bg-white/20 hover:bg-white/30 text-white' 
                      : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                  }`}
                  whileHover={{ scale: canDownload ? 1.1 : 1 }}
                  whileTap={{ scale: canDownload ? 0.9 : 1 }}
                  title={canDownload ? 'Download movie' : 'Upgrade to download'}
                >
                  {canDownload ? (
                    <Download size={24} />
                  ) : (
                    <Lock size={24} />
                  )}
                </motion.button>
              )}

              {/* Info button for when play is disabled */}
              {!showPlayButton && (
                <motion.button
                  className="bg-white/20 hover:bg-white/30 text-white p-4 rounded-full backdrop-blur-sm shadow-2xl"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Info size={24} />
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Movie Info - Minimal */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-1 group-hover:text-red-400 transition-colors">
            {movie.title}
          </h3>
          
          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>{movie.release_year}</span>
            {movie.file_size && (
              <span>{(movie.file_size / (1024 * 1024)).toFixed(0)}MB</span>
            )}
          </div>

          {/* Rating (if available) */}
          {movie.rating && (
            <div className="flex items-center gap-1 mt-2">
              <Star size={16} className="text-yellow-400 fill-current" />
              <span className="text-xs text-gray-400">{movie.rating}/10</span>
            </div>
          )}

          {/* Download Permission Indicator */}
          {!canDownload && showPlayButton && (
            <div className="mt-2 flex items-center gap-1 text-xs text-yellow-400">
              <Lock size={12} />
              <span>Upgrade to download</span>
            </div>
          )}

          {/* Subscription Required Badge */}
          {!showPlayButton && (
            <div className="mt-2 flex items-center gap-1 text-xs text-yellow-400">
              <Lock size={12} />
              <span>Subscribe to watch</span>
            </div>
          )}
        </div>

        {/* Quick Action Bar - Only show for subscribers */}
        {showPlayButton && (
          <div className={`px-4 py-3 bg-gray-750 border-t border-gray-700 transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0 h-0 py-0'
          }`}>
            <div className="flex justify-between items-center text-sm">
              <button
                onClick={handlePlay}
                className="text-red-400 hover:text-red-300 font-semibold flex items-center"
              >
                <Play size={16} className="mr-1" />
                Play
              </button>
              
              {/* Download action in quick bar */}
              <button
                onClick={canDownload ? handleDownload : handleDownloadBlocked}
                className={`flex items-center ${
                  canDownload 
                    ? 'text-gray-400 hover:text-white' 
                    : 'text-gray-500 cursor-not-allowed'
                }`}
                disabled={!canDownload}
              >
                {canDownload ? (
                  <Download size={16} className="mr-1" />
                ) : (
                  <Lock size={16} className="mr-1" />
                )}
                {canDownload ? 'Download' : 'Locked'}
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MovieCard;