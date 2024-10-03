const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Admin = sequelize.define('Admin', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true  // Ensure email is unique
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true  // Ensure username is unique
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'admin',  // Defaults to 'admin' for this model
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'https://cdn-icons-png.flaticon.com/128/560/560277.png'  // Default avatar URL
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

module.exports = Admin;
