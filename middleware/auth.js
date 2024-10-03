const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const SubAdmin = require('../models/subAdminModel');

// Middleware to verify JWT token and determine if the user is a sub-admin or admin
const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(403).json({ message: 'A token is required for authentication' });
    }

    try {
        // Verify the token and decode it to get the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // Store user ID for later use

        // Check if it's an admin
        const admin = await Admin.findByPk(req.userId);
        if (admin) {
            req.user = admin; // Attach admin to the request object
            req.userType = 'admin';
            return next(); // Proceed to the next middleware or route handler
        }

        // Check if it's a sub-admin
        const subAdmin = await SubAdmin.findByPk(req.userId);
        if (subAdmin) {
            req.user = subAdmin; // Attach sub-admin to the request object
            req.userType = 'sub-admin';
            return next(); // Proceed to the next middleware or route handler
        }

        // If neither admin nor sub-admin was found
        return res.status(404).json({ message: 'User not found' });

    } catch (err) {
        console.error('Token verification failed:', err);
        return res.status(401).json({ message: 'Invalid Token' });
    }
};


// Middleware to check if the authenticated user is an admin
const isAdmin = (req, res, next) => {
    if (req.userType !== 'admin') {
        return res.status(403).json({ message: 'Access denied, not an admin' });
    }
    next(); // Proceed to the next middleware or route handler
};

// Middleware to check if the authenticated user is a sub-admin
const isSubAdmin = (req, res, next) => {
    if (req.userType !== 'sub-admin') {
        return res.status(403).json({ message: 'Access denied, not a sub-admin' });
    }
    next(); // Proceed to the next middleware or route handler
};

module.exports = {
    verifyToken,
    isAdmin,
    isSubAdmin
};
