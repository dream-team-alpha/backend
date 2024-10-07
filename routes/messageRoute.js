const express = require('express');
const router = express.Router();
const { sendMessage, fetchMessageHistory } = require('../controllers/messageController');
const { verifyToken } = require('../middleware/auth');

// Route to send a message
router.post('/send', sendMessage);

// Route to fetch message history (token required)
router.get('/history/:userId/:adminId', verifyToken, fetchMessageHistory);

module.exports = router;
