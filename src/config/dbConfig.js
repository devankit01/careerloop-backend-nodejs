const { Sequelize } = require('sequelize');

// Database connection configuration
const sequelize = new Sequelize(
  process.env.DB_NAME || 'careerflow',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'rohit@2005',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

testConnection();

module.exports = sequelize; 