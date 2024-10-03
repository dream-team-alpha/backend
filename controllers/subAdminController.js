const SubAdmin = require('../models/subAdminModel');
const SubAdminAssignment = require('../models/subAdminAssignmentModel'); // Import the model

const User = require('../models/userModel');
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken');

// Add a new sub-admin
const addSubAdmin = async (req, res) => {
    console.log('Request Body:', req.body); // Log the request body

    const { email, firstName, lastName, password, passwordConfirmation } = req.body;

    try {
        const existingSubAdmin = await SubAdmin.findOne({ where: { email } });
        if (existingSubAdmin) {
            return res.status(400).json({ message: 'Sub-admin already exists' });
        }

        if (!firstName || !password || password !== passwordConfirmation) {
            return res.status(400).json({ message: 'First Name, Password, and Password Confirmation are required and must match' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newSubAdmin = await SubAdmin.create({
            email,
            firstName,
            lastName,
            password: hashedPassword
        });

        res.status(201).json({
            id: newSubAdmin.id,
            email: newSubAdmin.email,
            firstName: newSubAdmin.firstName,
            lastName: newSubAdmin.lastName,
            role: newSubAdmin.role
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//login subadmin
const loginSubAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const subAdmin = await SubAdmin.findOne({ where: { email } });
        if (!subAdmin) {
            return res.status(404).json({ message: 'Sub-admin not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, subAdmin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: subAdmin.id, role: 'sub-admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            token,
            subAdmin: {
                id: subAdmin.id,
                email: subAdmin.email,
                firstName: subAdmin.firstName,
                lastName: subAdmin.lastName,
                role: 'sub-admin',
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get all sub-admins
const getSubAdmins = async (req, res) => {
    try {
        const subAdmins = await SubAdmin.findAll();
        res.status(200).json(subAdmins);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Assign user to sub-admin
const assignUserToSubAdmin = async (req, res) => {
    const { userId, subAdminId } = req.body;

    try {
        const user = await User.findByPk(userId);
        const subAdmin = await SubAdmin.findByPk(subAdminId);

        if (!user || !subAdmin) {
            return res.status(404).json({ success: false, message: 'User or sub-admin not found' });
        }

        const existingAssignment = await SubAdminAssignment.findOne({ where: { userId, subAdminId } });
        if (existingAssignment) {
            return res.status(400).json({ success: false, message: 'User is already assigned to this sub-admin' });
        }

        const assignment = await SubAdminAssignment.create({ userId, subAdminId });

        res.status(200).json({ success: true, message: 'User assigned to sub-admin successfully', assignment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get a sub-admin by ID
const getSubAdminById = async (req, res) => {
    const { id } = req.params;

    try {
        const subAdmin = await SubAdmin.findByPk(id);
        if (!subAdmin) {
            return res.status(404).json({ message: 'Sub-admin not found' });
        }
        res.status(200).json(subAdmin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update sub-admin details
const updateSubAdmin = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;
    const avatar = req.file ? req.file.path : undefined; // Assuming you're using multer for file upload
  
    try {
      const subAdmin = await SubAdmin.findByPk(id);
      if (!subAdmin) {
        return res.status(404).json({ message: 'Sub-admin not found' });
      }
  
      // Update only the fields that are provided
      const updatedData = { firstName, lastName, email };
      if (avatar) {
        updatedData.avatar = avatar; // Update avatar if provided
      }
  
      await subAdmin.update(updatedData);
  
      res.status(200).json({ message: 'Sub-admin updated successfully', subAdmin });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
// Delete a sub-admin
const deleteSubAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const subAdmin = await SubAdmin.findByPk(id);
        if (!subAdmin) {
            return res.status(404).json({ message: 'Sub-admin not found' });
        }

        await subAdmin.destroy();
        res.status(200).json({ message: 'Sub-admin deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get assigned users for a specific sub-admin
const getAssignedUsersForSubAdmin = async (req, res) => {
    const subAdminId = req.params.id;

    try {
        // Step 1: Get the assignments for the specified sub-admin
        const assignments = await SubAdminAssignment.findAll({
            where: { subAdminId },
            attributes: ['userId'] // Only get userId for efficiency
        });

        // Check if there are no assignments
        if (!assignments.length) {
            return res.status(404).json({ message: 'No assigned users found' });
        }

        // Step 2: Extract user IDs from the assignments
        const userIds = assignments.map(assignment => assignment.userId);

        // Step 3: Fetch users based on extracted IDs
        const users = await User.findAll({
            where: {
                id: userIds
            }
        });

        // Step 4: Format the response, combining firstName and lastName as 'name'
        const assignedUsers = users.map(user => ({
            id: user.id,
            name: user.name, // Combine first and last name
            email: user.email,
        }));

        res.status(200).json(assignedUsers);
    } catch (error) {
        console.error("Error fetching assigned users:", error); // Log the error for debugging
        res.status(500).json({ error: error.message });
    }
};




module.exports = {
    addSubAdmin,
    loginSubAdmin,
    getSubAdmins,
    assignUserToSubAdmin,
    getSubAdminById,
    updateSubAdmin,
    deleteSubAdmin,
    getAssignedUsersForSubAdmin
};
