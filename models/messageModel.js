const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Message = sequelize.define('Message', {
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  senderType: {
    type: DataTypes.ENUM('admin', 'sub-admin', 'user'),
    allowNull: false,
  },
  receiverType: {
    type: DataTypes.ENUM('admin', 'sub-admin', 'user'),
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Message;
