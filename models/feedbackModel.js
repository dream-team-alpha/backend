const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Feedback = sequelize.define('Feedback', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Admins', 
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', 
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5 
    }
  },
  feedbackText: {
    type: DataTypes.TEXT,
    allowNull: true 
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

module.exports = Feedback;
