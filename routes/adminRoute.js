const express = require('express');
const { signup, login, updateAdmin, getAdminProfile } = require('../controllers/adminController'); 
const { validateAdminSignup } = require('../middleware/adminValidator');
const { verifyToken, isAdmin } = require('../middleware/auth'); 
const upload = require('../middleware/multerConfig'); // Import multer config

const router = express.Router();

// Log to confirm route setup
console.log("Setting up admin routes...");

// Route for admin signup with validation middleware
router.post('/signup', validateAdminSignup, signup);

// Route for admin login
router.post('/login', login);

// Route for updating admin profile (including avatar)
router.put('/profile/:id', verifyToken, isAdmin, upload.single('avatar'), updateAdmin); // Use upload middleware here

// Route for fetching admin profile
router.get('/profile/:id', verifyToken, isAdmin, getAdminProfile); // Use verification and authorization middleware here

module.exports = router;
