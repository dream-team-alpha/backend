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
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
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
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    get() {
      const dt = this.getDataValue('createdAt');
      return dt ? new Date(dt).toISOString().slice(0, 19).replace('T', ' ') : null;
    },
    set(value) {
      this.setDataValue('createdAt', new Date(value));
    }
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    get() {
      const dt = this.getDataValue('updatedAt');
      return dt ? new Date(dt).toISOString().slice(0, 19).replace('T', ' ') : null;
    },
    set(value) {
      this.setDataValue('updatedAt', new Date(value));
    }
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

module.exports = Admin;
