const express = require('express');
const { createUser, getAllUsers, getUserById } = require('../controllers/userController');

const router = express.Router();


router.post('/', createUser);  // Handles POST requests to /api/users
router.get('/', getAllUsers);  // Handles GET requests to /api/users
router.get('/:id', getUserById);

module.exports = router;
