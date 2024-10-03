const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SubAdmin = sequelize.define('SubAdmin', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
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
    unique: true,
    validate: {
      isEmail: true // Validate email format
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'sub-admin',
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'https://cdn-icons-png.flaticon.com/128/560/560277.png'  // Default avatar URL
  }
}, {
  timestamps: true
});

// Define associations
SubAdmin.associate = (models) => {
  SubAdmin.hasMany(models.SubAdminAssignment, {
    foreignKey: 'subAdminId',
    as: 'assignments'
  });
};

module.exports = SubAdmin;
