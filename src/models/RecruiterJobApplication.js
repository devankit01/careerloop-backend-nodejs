const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const RecruiterJobApplication = sequelize.define('RecruiterJobApplication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  job_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'recruiter_jobs',
      key: 'id'
    }
  },
  applicant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students', // Assuming job seekers are students in this system
      key: 'id'
    }
  },
  application_status: {
    type: DataTypes.ENUM('Applied', 'Reviewed', 'Interview', 'Rejected', 'Hired'),
    allowNull: false,
    defaultValue: 'Applied'
  },
  applied_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'recruiter_job_applications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = RecruiterJobApplication; 