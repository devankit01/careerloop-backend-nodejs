const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const JobData = sequelize.define('JobData', {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    allowNull: false
  },
  job_platform_id: {
    type: DataTypes.STRING(5000),
    allowNull: true
  },
  job_platform_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  job_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  data_source: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  data: {
    type: DataTypes.JSON,
    allowNull: true
  },
  job_title: {
    type: DataTypes.STRING(1000),
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(1000),
    allowNull: true
  },
  skill_required: {
    type: DataTypes.STRING(2000),
    allowNull: true
  },
  job_type: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  experience_needed: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  responsibilities: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  qualification: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'job_data',
  timestamps: false // We'll manage timestamps manually
});

module.exports = JobData;
