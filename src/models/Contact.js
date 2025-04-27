const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tag: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  first_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  phone_number: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  social_media_links: {
    type: DataTypes.JSON,
    allowNull: true
  },
  company: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  job_title: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  job_location: {
    type: DataTypes.STRING(255),
    allowNull: true
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
  tableName: 'contacts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Note: Associations are defined in src/config/dbInit.js

module.exports = Contact; 