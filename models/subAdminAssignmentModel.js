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
