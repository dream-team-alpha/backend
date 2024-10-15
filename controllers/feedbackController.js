const Feedback = require('../models/feedbackModel');
const Admin = require('../models/adminModel');
const User = require('../models/userModel'); // Make sure to require the User model

// Create a new feedback entry
const createFeedback = async (req, res) => {
  try {
    const { adminId, userId, rating, feedbackText } = req.body;

    // Ensure that the admin exists before submitting feedback
    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Ensure that the user exists before submitting feedback
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create feedback entry
    const feedback = await Feedback.create({
      adminId,
      userId,
      rating,
      feedbackText: feedbackText || null // Allow feedbackText to be optional
    });

    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports={
    createFeedback
}
