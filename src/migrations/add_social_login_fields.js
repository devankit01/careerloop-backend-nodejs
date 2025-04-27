'use strict';

const sequelize = require('../config/dbConfig');
const { QueryTypes } = require('sequelize');

module.exports = {
  up: async () => {
    try {
      // Check if provider column already exists
      const [providerExists] = await sequelize.query(
        "SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'provider'",
        { type: QueryTypes.SELECT }
      );
      
      // Check if provider_id column already exists
      const [providerIdExists] = await sequelize.query(
        "SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'provider_id'",
        { type: QueryTypes.SELECT }
      );
      
      // Add provider column if it doesn't exist
      if (parseInt(providerExists.count) === 0) {
        await sequelize.query(`ALTER TABLE users ADD COLUMN provider VARCHAR(255) NULL;`);
        console.log('Added provider column to users table');
      }
      
      // Add provider_id column if it doesn't exist
      if (parseInt(providerIdExists.count) === 0) {
        await sequelize.query(`ALTER TABLE users ADD COLUMN provider_id VARCHAR(255) NULL;`);
        console.log('Added provider_id column to users table');
      }
      
      // Set password to be nullable
      await sequelize.query(`ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NULL;`);
      console.log('Modified password column to be nullable');
      
      return Promise.resolve();
    } catch (error) {
      console.error('Migration error:', error);
      return Promise.reject(error);
    }
  },
  
  down: async () => {
    try {
      // Revert password column to not nullable
      await sequelize.query(`ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NOT NULL;`);
      
      // Drop provider_id column
      await sequelize.query(`ALTER TABLE users DROP COLUMN provider_id;`);
      
      // Drop provider column
      await sequelize.query(`ALTER TABLE users DROP COLUMN provider;`);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Migration rollback error:', error);
      return Promise.reject(error);
    }
  }
}; 