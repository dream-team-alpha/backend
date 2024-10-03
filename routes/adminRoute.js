const express = require('express');
const { signup, login, updateAdmin, getAdminProfile } = require('../controllers/adminController'); 
const { validateAdminSignup } = require('../middleware/adminValidator');
const { verifyToken, isAdmin } = require('../middleware/auth'); 
const upload = require('../middleware/multerConfig'); // Import multer config

const router = express.Router();

// Route for admin signup
router.post('/signup', validateAdminSignup, signup);

// Route for admin login
router.post('/login', login);

// Route for updating admin profile (including avatar upload)
router.put('/profile/:id', verifyToken, isAdmin, upload.single('avatar'), updateAdmin);

// Route for fetching admin profile
router.get('/profile/:id', verifyToken, isAdmin, getAdminProfile);

module.exports = router;
