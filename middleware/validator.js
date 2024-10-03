// validators/adminValidator.js
const { body, validationResult } = require('express-validator');

// Reusable validator for common fields
const validateField = (field, message, validationFn) => {
  return body(field).custom((value, { req }) => {
    const error = validationFn(value, req);
    if (error) {
      throw new Error(message);
    }
    return true;
  });
};

// Admin signup validation
exports.validateSignup = [
  validateField('firstName', 'First Name is required', (value) => value.trim() !== ''),
  validateField('lastName', 'Last Name is required', (value) => value.trim() !== ''),
  validateField('email', 'Email is invalid', (value) => {
    if (!value || !/\S+@\S+\.\S+/.test(value.trim())) {
      return true;  // Indicate an error
    }
  }),
  validateField('username', 'Username is required', (value) => value.trim() !== ''),
  validateField('password', 'Password must be at least 6 characters long', (value) => {
    if (!value || value.length < 6) {
      return true;  // Indicate an error
    }
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

