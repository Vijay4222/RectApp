const express = require('express');
const bidController = require('../controllers/bidController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Retrieve all bids for a specific item
router.get('/items/:itemId/bids', bidController.getBidsByItem);

// Place a new bid on a specific item (Authenticated users only)
router.post('/items/:itemId/bids', authenticate, bidController.placeBid);

module.exports = router;
