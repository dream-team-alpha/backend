const express = require('express');
const router = express.Router();
const {createFeedback} = require('../controllers/feedbackController');

// Route to create feedback
router.post('/submit', createFeedback);

module.exports = router;
