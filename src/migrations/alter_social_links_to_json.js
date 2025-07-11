'use strict';

const sequelize = require('../config/dbConfig');

module.exports = {
  up: async () => {
    try {
      // Change the column type from VARCHAR to JSON
      await sequelize.query(`
        ALTER TABLE students
        MODIFY COLUMN social_media_links JSON NULL;
      `);
      console.log(' Changed social_media_links to JSON');
      return Promise.resolve();
    } catch (error) {
      console.error(' Migration error:', error);
      return Promise.reject(error);
    }
  },

  down: async () => {
    try {
      // Revert it back to VARCHAR(255)
      await sequelize.query(`
        ALTER TABLE students
        MODIFY COLUMN social_media_links VARCHAR(255) NULL;
      `);
      console.log(' Reverted social_media_links back to VARCHAR');
      return Promise.resolve();
    } catch (error) {
      console.error(' Rollback error:', error);
      return Promise.reject(error);
    }
  }
};
