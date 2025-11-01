const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

router.get('/', subscriptionController.getSubscriptions);
router.put('/:userId/update', subscriptionController.updateSubscription);

module.exports = router;