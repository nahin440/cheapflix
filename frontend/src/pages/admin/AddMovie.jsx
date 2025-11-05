import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { movieService } from '../../services';
import { 
  Upload, 
  Film, 
  Image, 
  Clock, 
  Calendar,
  Tag,
  FileText,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AddMovie = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    release_year: new Date().getFullYear(),
    duration: '',
    description: '',
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Fantasy', 'Animation'];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file types
    if (type === 'video' && !file.type.startsWith('video/')) {
      setError('Please select a valid video file');
      return;
    }

    if (type === 'thumbnail' && !file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (type === 'video') {
      setVideoFile(file);
    } else {
      setThumbnailFile(file);
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.genre || !formData.duration || !videoFile) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const submitData = new FormData();
      
      submitData.append('video', videoFile);
      if (thumbnailFile) submitData.append('thumbnail', thumbnailFile);
      submitData.append('title', formData.title.trim());
      submitData.append('genre', formData.genre);
      submitData.append('release_year', formData.release_year.toString());
      submitData.append('duration', formData.duration.toString());
      submitData.append('description', formData.description.trim());

      await movieService.uploadMovie(submitData);
      
      setSuccess('Movie uploaded successfully! Redirecting...');
      
      setTimeout(() => navigate('/admin/manage-movies'), 2000);

    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (type) => {
    if (type === 'video') {
      setVideoFile(null);
    } else {
      setThumbnailFile(null);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8 pt-24">
      <div className="container mx-auto px-4 w-11/12 max-w-4xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Add New Movie
          </h1>
          <p className="text-gray-400 text-lg">Upload a new movie to your streaming library</p>
        </motion.div>

        {/* Messages */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {error && (
            <div className="bg-red-600/20 border border-red-500/50 text-red-400 p-4 rounded-2xl mb-6 flex items-center space-x-3">
              <AlertCircle size={20} />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-600/20 border border-green-500/50 text-green-400 p-4 rounded-2xl mb-6 flex items-center space-x-3">
              <CheckCircle size={20} />
              <span className="font-medium">{success}</span>
            </div>
          )}
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit} 
          variants={formVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 shadow-2xl"
        >
          {/* Basic Information */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Film className="mr-3" size={24} />
              Movie Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block text-white mb-3 font-medium flex items-center">
                  <Tag size={16} className="mr-2" />
                  Movie Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  placeholder="Enter movie title"
                  disabled={loading}
                />
              </div>

              {/* Genre */}
              <div>
                <label className="block text-white mb-3 font-medium flex items-center">
                  <Film size={16} className="mr-2" />
                  Genre *
                </label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  disabled={loading}
                >
                  <option value="">Select Genre</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              {/* Release Year */}
              <div>
                <label className="block text-white mb-3 font-medium flex items-center">
                  <Calendar size={16} className="mr-2" />
                  Release Year *
                </label>
                <input
                  type="number"
                  name="release_year"
                  value={formData.release_year}
                  onChange={handleInputChange}
                  required
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  disabled={loading}
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-white mb-3 font-medium flex items-center">
                  <Clock size={16} className="mr-2" />
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="500"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  placeholder="120"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="block text-white mb-3 font-medium flex items-center">
                <FileText size={16} className="mr-2" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm resize-none transition-all duration-200"
                placeholder="Enter movie description..."
                disabled={loading}
              />
            </div>
          </div>

          {/* File Uploads */}
          <div className="pt-6 border-t border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Upload className="mr-3" size={24} />
              Media Files
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Video File */}
              <div>
                <label className="block text-white mb-3 font-medium flex items-center">
                  <Film size={16} className="mr-2" />
                  Video File *
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-2xl p-6 text-center hover:border-red-500/50 transition-all duration-300 bg-gray-700/30">
                  {!videoFile ? (
                    <div>
                      <Upload size={48} className="text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-400 mb-2">Drop your video file here or click to browse</p>
                      <p className="text-gray-500 text-sm">MP4, AVI, MKV up to 2GB</p>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange(e, 'video')}
                        required
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={loading}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle size={20} className="text-green-400" />
                        <div className="text-left">
                          <p className="text-green-400 font-medium text-sm">{videoFile.name}</p>
                          <p className="text-green-400/70 text-xs">
                            {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile('video')}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        disabled={loading}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail File */}
              <div>
                <label className="block text-white mb-3 font-medium flex items-center">
                  <Image size={16} className="mr-2" />
                  Thumbnail Image
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-2xl p-6 text-center hover:border-red-500/50 transition-all duration-300 bg-gray-700/30">
                  {!thumbnailFile ? (
                    <div>
                      <Image size={48} className="text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-400 mb-2">Drop your thumbnail here or click to browse</p>
                      <p className="text-gray-500 text-sm">JPG, PNG, WebP up to 10MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'thumbnail')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={loading}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle size={20} className="text-blue-400" />
                        <div className="text-left">
                          <p className="text-blue-400 font-medium text-sm">{thumbnailFile.name}</p>
                          <p className="text-blue-400/70 text-xs">
                            {(thumbnailFile.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile('thumbnail')}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        disabled={loading}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-gray-700/50">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-4 rounded-xl font-semibold shadow-2xl transition-all duration-200 disabled:cursor-not-allowed flex-1 justify-center"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <Upload size={20} />
              )}
              <span>{loading ? 'Uploading...' : 'Upload Movie'}</span>
            </motion.button>
            
            <motion.button
              type="button"
              onClick={() => navigate('/admin/manage-movies')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 border border-gray-500/50"
            >
              Cancel
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default AddMovie;