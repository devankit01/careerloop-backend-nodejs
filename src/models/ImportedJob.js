const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const ImportedJob = sequelize.define('ImportedJob', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  job_title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  job_location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  company_info: {
    type: DataTypes.JSON,
    allowNull: true
  },
  job_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  salary: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  roles_and_responsibilities: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  skills: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  perks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imported_job_status: {
    type: DataTypes.ENUM('Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'),
    allowNull: true,
    defaultValue: 'Saved'
  },
  jobseeker_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id'
    }
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
  tableName: 'imported_jobs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Note: Associations are defined in src/config/dbInit.js

module.exports = ImportedJob; 