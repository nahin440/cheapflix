const db = require('../config/database');

const Movie = {
  async create(movieData) {
    const sql = `INSERT INTO movies 
      (title, genre, release_year, duration, description, file_url, thumbnail_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    const [result] = await db.execute(sql, [
      movieData.title,
      movieData.genre,
      movieData.release_year,
      movieData.duration,
      movieData.description,
      movieData.file_url,
      movieData.thumbnail_url
    ]);
    
    return result.insertId;
  },

  async getAll() {
    const [rows] = await db.execute('SELECT * FROM movies ORDER BY added_at DESC');
    return rows;
  },

  async findById(movieId) {
    const [rows] = await db.execute('SELECT * FROM movies WHERE movie_id = ?', [movieId]);
    return rows[0];
  },

  async delete(movieId) {
    const [result] = await db.execute('DELETE FROM movies WHERE movie_id = ?', [movieId]);
    return result.affectedRows > 0;
  }
};

module.exports = Movie;