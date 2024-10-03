const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');

// Admin Signup
exports.signup = async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
      role: 'admin'
    });

    res.status(201).json({ message: 'Admin registered successfully!', admin });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin Login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
      admin: { id: admin.id, username: admin.username, role: admin.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Update admin details (including avatar)
exports.updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { username, email, firstName, lastName } = req.body; // Extract relevant fields from request body

  // Check if a new avatar has been uploaded
  const avatar = req.file ? req.file.filename : undefined; // Get uploaded file if it exists

  try {
    // Find the admin by ID
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Create an object with updated fields
    const updatedData = {
      username,
      email,
      firstName,
      lastName,
    };

    // If a new avatar has been uploaded, add it to the update object
    if (avatar) {
      updatedData.avatar = `/uploads/${avatar}`; // Save avatar path (relative to the server)
    }

    // Update the admin record with the new data
    await admin.update(updatedData);

    // Respond with the updated admin profile
    res.status(200).json({ message: 'Admin updated successfully', admin });
  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.getAdminProfile = async (req, res) => {
  try {
    const adminId = req.params.id; // Get admin ID from request parameters
    const admin = await Admin.findByPk(adminId); // Fetch admin from the database

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Send back the admin profile without sensitive information (like password)
    const { password, ...adminProfile } = admin.toJSON(); // Exclude password field
    return res.status(200).json(adminProfile);
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};