const Movie = require('../models/Movie');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

// Define upload directories - CORRECT PATHS for your structure
const videosDir = path.join(__dirname, '../../uploads/videos');
const thumbnailsDir = path.join(__dirname, '../../uploads/thumbnails');

// Ensure directories exist
fs.ensureDirSync(videosDir);
fs.ensureDirSync(thumbnailsDir);

// Simple storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'video') {
      cb(null, videosDir);
    } else {
      cb(null, thumbnailsDir);
    }
  },
  filename: (req, file, cb) => {
    const name = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + name + path.extname(file.originalname));
  }
});

// Accept all files
const upload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, true)
}).fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

const movieController = {
  // Upload movie
  async uploadMovie(req, res) {
    try {
      console.log('Upload request received');

      if (!req.files?.video) {
        return res.status(400).json({ 
          success: false,
          message: 'Video file is required' 
        });
      }

      const videoFile = req.files.video[0];
      const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;

      const { title, genre, release_year, duration, description } = req.body;
      
      if (!title?.trim() || !genre?.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Title and genre are required'
        });
      }

      // Simple movie data
      const movieData = {
        title: title.trim(),
        genre: genre.trim(),
        release_year: parseInt(release_year) || new Date().getFullYear(),
        duration: parseInt(duration) || 0,
        description: description?.trim() || '',
        file_url: videoFile.filename,
        thumbnail_url: thumbnailFile ? thumbnailFile.filename : null,
        added_by_admin: null
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
      if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
      res.json({ success: true, movie });
    } catch (error) {
      console.error('Get movie error:', error);
      res.status(500).json({ success: false, message: 'Error fetching movie' });
    }
  },

  // Delete movie
  async deleteMovie(req, res) {
    try {
      const deleted = await Movie.delete(req.params.movieId);
      if (!deleted) return res.status(404).json({ success: false, message: 'Movie not found' });
      res.json({ success: true, message: 'Movie deleted' });
    } catch (error) {
      console.error('Delete movie error:', error);
      res.status(500).json({ success: false, message: 'Error deleting movie' });
    }
  },

  // Stream movie
  async streamMovie(req, res) {
    try {
      console.log('Stream request for movie ID:', req.params.movieId);
      
      const movie = await Movie.findById(req.params.movieId);
      if (!movie) {
        console.log('Movie not found in database');
        return res.status(404).json({ success: false, message: 'Movie not found' });
      }

      if (!movie.file_url) {
        console.log('Movie has no file URL');
        return res.status(404).json({ success: false, message: 'Video file not found' });
      }

      const videoPath = path.join(videosDir, movie.file_url);
      console.log('Looking for video at:', videoPath);
      
      // Check if file exists
      if (!fs.existsSync(videoPath)) {
        console.log('Video file does not exist at path');
        return res.status(404).json({ success: false, message: 'Video file not found on server' });
      }

      const stat = fs.statSync(videoPath);
      const fileSize = stat.size;
      const range = req.headers.range;

      console.log('File found, size:', fileSize, 'Range header:', range);

      if (range) {
        // Handle range requests for seeking
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        
        console.log(`Streaming bytes ${start}-${end}/${fileSize}`);
        
        const file = fs.createReadStream(videoPath, { start, end });
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        // Send entire file
        console.log('Streaming entire file');
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
      }
    } catch (error) {
      console.error('Stream error:', error);
      res.status(500).json({ success: false, message: 'Error streaming video' });
    }
  },

  // Get thumbnail
  async getThumbnail(req, res) {
    try {
      console.log('Thumbnail request for movie ID:', req.params.movieId);
      
      const movie = await Movie.findById(req.params.movieId);
      if (!movie) {
        return res.status(404).json({ success: false, message: 'Movie not found' });
      }

      // If no thumbnail, return default image
      if (!movie.thumbnail_url) {
        console.log('No thumbnail, returning default');
        // Create a simple SVG as default thumbnail
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
      console.log('Looking for thumbnail at:', thumbnailPath);
      
      // Check if file exists
      if (!fs.existsSync(thumbnailPath)) {
        console.log('Thumbnail file does not exist, returning default');
        // Return default image if thumbnail doesn't exist
        const svg = `
          <svg width="300" height="450" viewBox="0 0 300 450" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="450" fill="#1F2937"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6B7280" font-family="monospace" font-size="14">No Thumbnail</text>
          </svg>
        `;
        res.set('Content-Type', 'image/svg+xml');
        return res.send(svg);
      }

      // Determine content type based on file extension
      const ext = path.extname(movie.thumbnail_url).toLowerCase();
      const contentTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml'
      };

      console.log('Serving thumbnail with content type:', contentTypes[ext] || 'image/jpeg');
      res.set('Content-Type', contentTypes[ext] || 'image/jpeg');
      fs.createReadStream(thumbnailPath).pipe(res);

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