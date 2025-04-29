'use strict';

const sequelize = require('../config/dbConfig');
const { QueryTypes } = require('sequelize');

module.exports = {
  up: async () => {
    try {
      // Check if last_login column already exists
      const [lastLoginExists] = await sequelize.query(
        "SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'last_login'",
        { type: QueryTypes.SELECT }
      );
      
      // Check if last_active column already exists
      const [lastActiveExists] = await sequelize.query(
        "SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'last_active'",
        { type: QueryTypes.SELECT }
      );
      
      // Add last_login column if it doesn't exist
      if (parseInt(lastLoginExists.count) === 0) {
        await sequelize.query(`ALTER TABLE users ADD COLUMN last_login DATETIME NULL;`);
        console.log('Added last_login column to users table');
      }
      
      // Add last_active column if it doesn't exist
      if (parseInt(lastActiveExists.count) === 0) {
        await sequelize.query(`ALTER TABLE users ADD COLUMN last_active DATETIME NULL;`);
        console.log('Added last_active column to users table');
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Migration error:', error);
      return Promise.reject(error);
    }
  },
  
  down: async () => {
    try {
      // Drop last_login column
      await sequelize.query(`ALTER TABLE users DROP COLUMN last_login;`);
      
      // Drop last_active column
      await sequelize.query(`ALTER TABLE users DROP COLUMN last_active;`);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Migration rollback error:', error);
      return Promise.reject(error);
    }
  }
}; 