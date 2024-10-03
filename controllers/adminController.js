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
  console.log("Update admin function called");
  const { id } = req.params;
  const { username, email, firstName, lastName } = req.body; // Extract firstName and lastName from the request body
  console.log('Request Body:', req.body); // Log the incoming request body

  const avatar = req.file ? req.file.path : undefined; // Check if avatar upload is present

  try {
    console.log(`Updating admin with ID: ${id}`);
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Create an updated data object including firstName, lastName, username, email, and avatar
    const updatedData = {
      username,
      email,
      firstName,  // Add firstName to the updated data
      lastName    // Add lastName to the updated data
    };

    // Include avatar only if it exists
    if (avatar) {
      updatedData.avatar = avatar; 
    }

    // Log the updated data to check if all fields are included
    console.log('Updated Data:', updatedData);
    
    // Update the admin with the new data
    await admin.update(updatedData);
    console.log('Admin updated:', admin); // Log the updated admin object

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