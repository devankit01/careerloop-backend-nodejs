'use strict';

const sequelize = require('../config/dbConfig');
const { QueryTypes } = require('sequelize');

module.exports = {
  up: async () => {
    try {
      // Check if the foreign key already exists
      const result = await sequelize.query(
        `SELECT CONSTRAINT_NAME 
         FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
         WHERE TABLE_NAME = 'imported_jobs' 
         AND COLUMN_NAME = 'jobseeker_id' 
         AND REFERENCED_TABLE_NAME IS NOT NULL;`,
        { type: QueryTypes.SELECT }
      );

      if (result.length === 0) {
        // Add the foreign key
        await sequelize.query(`
          ALTER TABLE imported_jobs
          ADD CONSTRAINT imported_jobs_ibfk_1
          FOREIGN KEY (jobseeker_id)
          REFERENCES students(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE;
        `);
        console.log('Foreign key added to imported_jobs.jobseeker_id');
      } else {
        console.log('Foreign key already exists on imported_jobs.jobseeker_id');
      }

      return Promise.resolve();
    } catch (error) {
      console.error('Migration error:', error);
      return Promise.reject(error);
    }
  },

  down: async () => {
    try {
      // Remove the foreign key
      await sequelize.query(`
        ALTER TABLE imported_jobs
        DROP FOREIGN KEY imported_jobs_ibfk_1;
      `);
      console.log('Foreign key removed from imported_jobs.jobseeker_id');

      return Promise.resolve();
    } catch (error) {
      console.error('Migration rollback error:', error);
      return Promise.reject(error);
    }
  }
};
