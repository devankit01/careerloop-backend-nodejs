const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

// Default statuses that will always be available
const DEFAULT_STATUSES = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

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
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'Saved',
    validate: {
      isValidStatus(value) {
        if (value && !DEFAULT_STATUSES.includes(value)) {
          // Allow custom statuses but ensure they're not empty and are strings
          if (typeof value !== 'string' || value.trim().length === 0) {
            throw new Error('Invalid job status');
          }
        }
      }
    }
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

// Add a static method to get all available statuses
ImportedJob.getAvailableStatuses = function() {
  return [...DEFAULT_STATUSES];
};

// Note: Associations are defined in src/config/dbInit.js

module.exports = ImportedJob; 