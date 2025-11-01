import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieService, authService } from '../../services';

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

  const user = authService.getCurrentUser();
  const isAdmin = user && user.user_id;

  const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi'];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'video') {
      setVideoFile(file);
    } else {
      setThumbnailFile(file);
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAdmin) {
      setError('Admin access required');
      return;
    }

    if (!formData.title.trim() || !formData.genre || !formData.duration || !videoFile) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError('');

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
      
      // Success - redirect
      setTimeout(() => navigate('/admin/manage-movies'), 1000);

    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Access Denied</div>
          <button 
            onClick={() => navigate('/movies')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
          >
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Add New Movie</h1>
          <p className="text-gray-400">Upload a new movie</p>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 rounded-xl p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2">Movie Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="Enter title"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-white mb-2">Genre *</label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                disabled={loading}
              >
                <option value="">Select Genre</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">Release Year *</label>
              <input
                type="number"
                name="release_year"
                value={formData.release_year}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-white mb-2">Duration (min) *</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="120"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-white mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              placeholder="Movie description..."
              disabled={loading}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2">Video File *</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileChange(e, 'video')}
                required
                className="w-full text-white"
                disabled={loading}
              />
              {videoFile && <p className="text-green-400 text-sm mt-1">Selected: {videoFile.name}</p>}
            </div>

            <div>
              <label className="block text-white mb-2">Thumbnail Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'thumbnail')}
                className="w-full text-white"
                disabled={loading}
              />
              {thumbnailFile && <p className="text-green-400 text-sm mt-1">Selected: {thumbnailFile.name}</p>}
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-2 rounded transition-colors"
            >
              {loading ? 'Uploading...' : 'Upload Movie'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/admin/manage-movies')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMovie;