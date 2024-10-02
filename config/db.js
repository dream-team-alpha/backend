const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,  // Database name
  process.env.DB_USER,  // Username
  process.env.DB_PASSWORD,  // Password
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',  // Use MySQL
    port: process.env.DB_PORT
  }
);

// Test the connection
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('Database connection failed:', err));

module.exports = sequelize;
