const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/movies', adminController.addMovie);
router.get('/users', adminController.getUsers);
router.get('/revenue', adminController.getRevenueReport);
router.get('/payments', adminController.getAllPayments);

module.exports = router;