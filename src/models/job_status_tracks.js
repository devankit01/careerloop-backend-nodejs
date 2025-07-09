const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const JobStatusTrack = sequelize.define('JobStatusTrack', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  jobseeker_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students', // or 'jobseekers' if named differently
      key: 'id',
    },
  },
  job_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'imported_jobs',
      key: 'id',
    },
  },
  status: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'job_status_tracks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = JobStatusTrack;
