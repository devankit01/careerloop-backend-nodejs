const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

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
  job_platform_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  company_info: {
    type: DataTypes.JSON,
    allowNull: true
  },
  job_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  data_source: {
    type: DataTypes.STRING(5000),
    allowNull: true
  },
  data: {
    type: DataTypes.JSON,
    allowNull: true
  },
  salary: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  employment_type: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  experience_needed: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  responsibilities: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  qualification: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  skill_required: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  perks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  job_raw_text: {
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

ImportedJob.getAvailableStatuses = function() {
  return [...DEFAULT_STATUSES];
};

module.exports = ImportedJob;
