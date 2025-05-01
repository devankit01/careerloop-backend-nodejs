'use strict';

const sequelize = require('../config/dbConfig');
const { QueryTypes } = require('sequelize');

module.exports = {
  up: async () => {
    try {
      // Check if college_data table already exists
      const [tableExists] = await sequelize.query(
        "SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'college_data'",
        { type: QueryTypes.SELECT }
      );
      
      // Create college_data table if it doesn't exist
      if (parseInt(tableExists.count) === 0) {
        await sequelize.query(`
          CREATE TABLE college_data (
            college_id INT PRIMARY KEY AUTO_INCREMENT,
            college_name VARCHAR(255) NOT NULL,
            genders_accepted ENUM('girls', 'boys', 'co-ed') NOT NULL,
            campus_size_acres DECIMAL(10,2),
            total_student_enrollments INT CHECK (total_student_enrollments >= 0),
            total_faculty INT CHECK (total_faculty >= 0),
            established_year INT CHECK (established_year > 1500),
            rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
            university VARCHAR(255),
            courses TEXT,
            facilities TEXT,
            city VARCHAR(100) NOT NULL,
            state VARCHAR(100),
            country VARCHAR(100) NOT NULL,
            college_type VARCHAR(100) NOT NULL,
            average_fees_annual DECIMAL(12,2) CHECK (average_fees_annual >= 0),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          );
        `);
        console.log('Created college_data table');
      } else {
        console.log('college_data table already exists');
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Migration error:', error);
      return Promise.reject(error);
    }
  },
  
  down: async () => {
    try {
      // Drop college_data table
      await sequelize.query(`DROP TABLE IF EXISTS college_data;`);
      console.log('Dropped college_data table');
      
      return Promise.resolve();
    } catch (error) {
      console.error('Migration rollback error:', error);
      return Promise.reject(error);
    }
  }
}; 