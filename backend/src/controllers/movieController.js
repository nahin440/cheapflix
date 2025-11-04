const Movie = require('../models/Movie');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Upload directories - outside src but inside project
const uploadsDir = path.join(__dirname, '../../uploads');
const videosDir = path.join(uploadsDir, 'videos');
const thumbnailsDir = path.join(uploadsDir, 'thumbnails');

// Create directories if they don't exist
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir);
if (!fs.existsSync(thumbnailsDir)) fs.mkdirSync(thumbnailsDir);

// Simple storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'video') {
      cb(null, videosDir);
    } else {
      cb(null, thumbnailsDir);
    }
  },
  filename: (req, file, cb) => {
    // Rename files with timestamp and original extension
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${timestamp}${ext}`;
    cb(null, filename);
  }
});

// Accept all file types
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    cb(null, true); // Accept all files
  }
}).fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

const movieController = {
  // Upload movie
  async uploadMovie(req, res) {
    try {
      console.log('Uploading movie...');

      if (!req.files?.video) {
        return res.status(400).json({ 
          success: false,
          message: 'Video file is required' 
        });
      }

      const videoFile = req.files.video[0];
      const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;

      const { title, genre, release_year, duration, description } = req.body;
      
      // Basic validation
      if (!title || !genre) {
        return res.status(400).json({
          success: false,
          message: 'Title and genre are required'
        });
      }

      // Create movie data
      const movieData = {
        title: title.trim(),
        genre: genre.trim(),
        release_year: parseInt(release_year) || new Date().getFullYear(),
        duration: parseInt(duration) || 0,
        description: description?.trim() || '',
        file_url: videoFile.filename, // Store renamed filename
        thumbnail_url: thumbnailFile ? thumbnailFile.filename : null
      };

      // Save to database
      const movie_id = await Movie.create(movieData);

      res.status(201).json({ 
        success: true,
        message: 'Movie uploaded successfully',
        movie_id
      });

    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error uploading movie'
      });
    }
  },

  // Get all movies
  async getAllMovies(req, res) {
    try {
      const movies = await Movie.getAll();
      res.json({ success: true, movies });
    } catch (error) {
      console.error('Get all movies error:', error);
      res.status(500).json({ success: false, message: 'Error fetching movies' });
    }
  },

  // Get single movie
  async getMovie(req, res) {
    try {
      const movie = await Movie.findById(req.params.movieId);
      if (!movie) {
        return res.status(404).json({ success: false, message: 'Movie not found' });
      }
      res.json({ success: true, movie });
    } catch (error) {
      console.error('Get movie error:', error);
      res.status(500).json({ success: false, message: 'Error fetching movie' });
    }
  },

  // Delete movie
  async deleteMovie(req, res) {
    try {
      const movieId = req.params.movieId;
      
      // Get movie details first
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).json({ success: false, message: 'Movie not found' });
      }

      // Delete files from storage
      if (movie.file_url) {
        const videoPath = path.join(videosDir, movie.file_url);
        if (fs.existsSync(videoPath)) {
          fs.unlinkSync(videoPath);
        }
      }

      if (movie.thumbnail_url) {
        const thumbPath = path.join(thumbnailsDir, movie.thumbnail_url);
        if (fs.existsSync(thumbPath)) {
          fs.unlinkSync(thumbPath);
        }
      }

      // Delete from database
      const deleted = await Movie.delete(movieId);
      
      res.json({ success: true, message: 'Movie deleted successfully' });

    } catch (error) {
      console.error('Delete movie error:', error);
      res.status(500).json({ success: false, message: 'Error deleting movie' });
    }
  },

  // Stream movie
  async streamMovie(req, res) {
    try {
      const movieId = req.params.movieId;
      const movie = await Movie.findById(movieId);
      
      if (!movie || !movie.file_url) {
        return res.status(404).json({ success: false, message: 'Movie not found' });
      }

      const videoPath = path.join(videosDir, movie.file_url);
      
      if (!fs.existsSync(videoPath)) {
        return res.status(404).json({ success: false, message: 'Video file not found' });
      }

      // Simple file streaming
      res.sendFile(videoPath);
      
    } catch (error) {
      console.error('Stream error:', error);
      res.status(500).json({ success: false, message: 'Error streaming video' });
    }
  },

  // Get thumbnail
  async getThumbnail(req, res) {
    try {
      const movieId = req.params.movieId;
      const movie = await Movie.findById(movieId);
      
      if (!movie) {
        return res.status(404).json({ success: false, message: 'Movie not found' });
      }

      // If no thumbnail, return default
      if (!movie.thumbnail_url) {
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
      
      if (!fs.existsSync(thumbnailPath)) {
        const svg = `
          <svg width="300" height="450" viewBox="0 0 300 450" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="450" fill="#1F2937"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6B7280" font-family="monospace" font-size="14">No Thumbnail</text>
          </svg>
        `;
        res.set('Content-Type', 'image/svg+xml');
        return res.send(svg);
      }

      // Send thumbnail file
      res.sendFile(thumbnailPath);

    } catch (error) {
      console.error('Thumbnail error:', error);
      res.status(500).json({ success: false, message: 'Error loading thumbnail' });
    }
  }
};

module.exports = {
  movieController,
  uploadVideo: upload
};