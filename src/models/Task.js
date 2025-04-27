const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  is_done: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  jobseeker_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id'
    }
  },
  imported_job_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'imported_jobs',
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
  tableName: 'tasks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Note: Associations are defined in src/config/dbInit.js

module.exports = Task; 