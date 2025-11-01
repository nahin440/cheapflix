const fs = require('fs-extra');
const path = require('path');

const uploadsDir = path.join(__dirname, '../../uploads');
const videosDir = path.join(uploadsDir, 'videos');
const thumbnailsDir = path.join(uploadsDir, 'thumbnails');

// Create directories if they don't exist
const initializeDirectories = async () => {
  await fs.ensureDir(videosDir);
  await fs.ensureDir(thumbnailsDir);
  console.log('Upload directories initialized');
};

const getVideoPath = (filename) => path.join(videosDir, filename);
const getThumbnailPath = (filename) => path.join(thumbnailsDir, filename);

module.exports = {
  initializeDirectories,
  getVideoPath,
  getThumbnailPath,
  videosDir,
  thumbnailsDir
};