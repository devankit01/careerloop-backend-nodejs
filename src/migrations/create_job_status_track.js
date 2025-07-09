'use strict';

const sequelize = require('../config/dbConfig');
const { QueryTypes } = require('sequelize');

module.exports = {
  up: async () => {
    try {
      // Check if the table already exists
      const [tableExists] = await sequelize.query(
        "SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'job_status_tracks'",
        { type: QueryTypes.SELECT }
      );

      // Create the table if it doesn't exist
      if (parseInt(tableExists.count) === 0) {
        await sequelize.query(`
          CREATE TABLE job_status_tracks (
            id INT PRIMARY KEY AUTO_INCREMENT,
            jobseeker_id INT NOT NULL,
            job_id INT NOT NULL,
            status VARCHAR(100) NOT NULL,
            type VARCHAR(100) NOT NULL,
            timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

            FOREIGN KEY (jobseeker_id) REFERENCES students(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (job_id) REFERENCES imported_jobs(id) ON DELETE CASCADE ON UPDATE CASCADE
          );
        `);
        console.log('Created job_status_tracks table');
      } else {
        console.log('job_status_tracks table already exists');
      }

      return Promise.resolve();
    } catch (error) {
      console.error('Migration error:', error);
      return Promise.reject(error);
    }
  },

  down: async () => {
    try {
      await sequelize.query(`DROP TABLE IF EXISTS job_status_tracks;`);
      console.log('Dropped job_status_tracks table');

      return Promise.resolve();
    } catch (error) {
      console.error('Migration rollback error:', error);
      return Promise.reject(error);
    }
  }
};