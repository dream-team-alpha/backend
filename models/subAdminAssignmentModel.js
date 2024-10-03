// models/subAdminAssignmentModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const SubAdmin = require('./subAdminModel');
const User = require('./userModel');

// Define the SubAdminAssignment model
const SubAdminAssignment = sequelize.define('SubAdminAssignment', {
  subAdminId: {
    type: DataTypes.INTEGER,
    references: {
      model: SubAdmin,
      key: 'id'
    },
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: false,
  }
}, {
  timestamps: true
});

// Define associations
SubAdminAssignment.associate = (models) => {
  SubAdminAssignment.belongsTo(models.SubAdmin, {
    foreignKey: 'subAdminId',
    as: 'subAdmin',
  });
  
  SubAdminAssignment.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user',
  });
};

module.exports = SubAdminAssignment;
