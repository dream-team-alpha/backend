const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true // Validate email format
    }
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
User.associate = (models) => {
  User.hasMany(models.SubAdminAssignment, {
    foreignKey: 'userId',
    as: 'assignments'
  });
};

module.exports = User;
