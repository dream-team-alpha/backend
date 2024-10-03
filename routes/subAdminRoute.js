const express = require('express');
const {
    addSubAdmin,
    loginSubAdmin,
    getSubAdmins,
    assignUserToSubAdmin,
    updateSubAdmin,
    deleteSubAdmin,
    getSubAdminById,
    getAssignedUsersForSubAdmin
} = require('../controllers/subAdminController');
const { verifyToken, isAdmin, isSubAdmin } = require('../middleware/auth');

const router = express.Router();

// Route to add a new sub-admin
router.post('/add', verifyToken, isAdmin, addSubAdmin);

// Route to log in as a sub-admin
router.post('/login', loginSubAdmin); // No auth needed

// Route to get all sub-admins
router.get('/', verifyToken, isAdmin, getSubAdmins);

// Route to assign a user to a sub-admin
router.post('/assign', verifyToken, isAdmin, assignUserToSubAdmin);

// Route to get a sub-admin by ID
router.get('/:id', verifyToken, isAdmin, getSubAdminById);

// Route to update sub-admin details
router.put('/:id', verifyToken, isAdmin, updateSubAdmin);

// Route to delete a sub-admin
router.delete('/:id', verifyToken, isAdmin, deleteSubAdmin);

// Route to get assigned users for a specific sub-admin
router.get('/assigned-users/:id', verifyToken, isSubAdmin, getAssignedUsersForSubAdmin); // Ensure sub-admin can see their assigned users

module.exports = router;
