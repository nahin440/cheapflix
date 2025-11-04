const express = require('express');
const router = express.Router();
const { movieController, uploadVideo } = require('../controllers/movieController');

// Test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Movies router is working!' });
});

// Upload movie
router.post('/', uploadVideo, movieController.uploadMovie);

// Get all movies
router.get('/', movieController.getAllMovies);

// Get single movie
router.get('/:movieId', movieController.getMovie);

// Delete movie
router.delete('/:movieId', movieController.deleteMovie);

// Stream movie
router.get('/:movieId/stream', movieController.streamMovie);

// Get thumbnail
router.get('/:movieId/thumbnail', movieController.getThumbnail);

console.log('✅ Movies routes loaded!');

module.exports = router;