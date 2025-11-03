const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const path = require('path');
const fs = require('fs-extra');

// Define upload directories - FIXED PATHS for src/routes structure
const videosDir = path.join(__dirname, '../../uploads/videos');
const thumbnailsDir = path.join(__dirname, '../../uploads/thumbnails');

console.log('📁 Video directory path:', videosDir);
console.log('📁 Thumbnail directory path:', thumbnailsDir);

// Test if directories exist
if (fs.existsSync(videosDir)) {
  console.log('✅ Videos directory exists');
} else {
  console.log('❌ Videos directory does not exist');
}

if (fs.existsSync(thumbnailsDir)) {
  console.log('✅ Thumbnails directory exists');
} else {
  console.log('❌ Thumbnails directory does not exist');
}

// Test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Movies router is working!' });
});

// Get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.getAll();
    res.json({ success: true, movies });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ success: false, message: 'Error fetching movies' });
  }
});

// Get single movie
router.get('/:movieId', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    res.json({ success: true, movie });
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({ success: false, message: 'Error fetching movie' });
  }
});

// Stream movie
router.get('/:movieId/stream', async (req, res) => {
  try {
    console.log('🎬 Stream request for movie ID:', req.params.movieId);
    
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      console.log('❌ Movie not found in database');
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    console.log('📁 Movie found:', {
      id: movie.movie_id,
      title: movie.title,
      file_url: movie.file_url
    });

    if (!movie.file_url) {
      console.log('❌ Movie has no file URL');
      return res.status(404).json({ success: false, message: 'Video file not found' });
    }

    const videoPath = path.join(videosDir, movie.file_url);
    console.log('🔍 Looking for video at:', videoPath);
    
    // Check if file exists
    if (!fs.existsSync(videoPath)) {
      console.log('❌ Video file does not exist at path');
      // List files in videos directory for debugging
      try {
        const files = fs.readdirSync(videosDir);
        console.log('📂 Files in videos directory:', files);
      } catch (err) {
        console.log('❌ Cannot read videos directory:', err.message);
      }
      return res.status(404).json({ success: false, message: 'Video file not found on server' });
    }

    console.log('✅ Video file found, streaming...');
    
    // Simple file streaming
    res.sendFile(videoPath);
    
  } catch (error) {
    console.error('Stream error:', error);
    res.status(500).json({ success: false, message: 'Error streaming video' });
  }
});

// Get thumbnail
router.get('/:movieId/thumbnail', async (req, res) => {
  try {
    console.log('🖼️ Thumbnail request for movie ID:', req.params.movieId);
    
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    // If no thumbnail, return default image
    if (!movie.thumbnail_url) {
      console.log('No thumbnail, returning default');
      const svg = `
        <svg width="300" height="450" viewBox="0 0 300 450" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="450" fill="#1F2937"/>
          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6B7280" font-family="monospace" font-size="14">No Image</text>
        </svg>
      `;
      res.set('Content-Type', 'image/svg+xml');
      return res.send(svg);
    }

    const thumbnailPath = path.join(thumbnailsDir, movie.thumbnail_url);
    console.log('🔍 Looking for thumbnail at:', thumbnailPath);
    
    // Check if file exists
    if (!fs.existsSync(thumbnailPath)) {
      console.log('Thumbnail file does not exist, returning default');
      const svg = `
        <svg width="300" height="450" viewBox="0 0 300 450" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="450" fill="#1F2937"/>
          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6B7280" font-family="monospace" font-size="14">No Thumbnail</text>
        </svg>
      `;
      res.set('Content-Type', 'image/svg+xml');
      return res.send(svg);
    }

    console.log('✅ Thumbnail found, sending...');
    res.sendFile(thumbnailPath);

  } catch (error) {
    console.error('Thumbnail error:', error);
    res.status(500).json({ success: false, message: 'Error loading thumbnail' });
  }
});

console.log('✅ Movies routes loaded!');

module.exports = router;