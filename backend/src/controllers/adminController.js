const Movie = require('../models/Movie');
const User = require('../models/User');
const Payment = require('../models/Payment');

const adminController = {
  async addMovie(req, res) {
    try {
      const { title, genre, release_year, duration, description, file_url, thumbnail_url, added_by_admin } = req.body;

      const movie_id = await Movie.create({
        title,
        genre,
        release_year,
        duration,
        description,
        file_url,
        thumbnail_url,
        added_by_admin
      });

      // Here you would send email notifications to all users
      // For now, we'll just return success

      res.status(201).json({ 
        message: 'Movie added successfully',
        movie_id 
      });
    } catch (error) {
      console.error('Add movie error:', error);
      res.status(500).json({ message: 'Error adding movie' });
    }
  },

  async getUsers(req, res) {
    try {
      const users = await User.getAll();
      res.json({ users });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  },

  async getRevenueReport(req, res) {
    try {
      const revenue = await Payment.getRevenueReport();
      res.json({ revenue });
    } catch (error) {
      console.error('Get revenue report error:', error);
      res.status(500).json({ message: 'Error fetching revenue report' });
    }
  },

  async getAllPayments(req, res) {
    try {
      const payments = await Payment.getAllPayments();
      res.json({ payments });
    } catch (error) {
      console.error('Get all payments error:', error);
      res.status(500).json({ message: 'Error fetching payments' });
    }
  }
};

module.exports = adminController;