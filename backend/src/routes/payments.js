const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/process', paymentController.processPayment);
router.get('/:userId/history', paymentController.getPaymentHistory);

module.exports = router;