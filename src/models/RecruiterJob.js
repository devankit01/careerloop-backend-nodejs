const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const RecruiterJob = sequelize.define('RecruiterJob', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  recruiter_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'recruiters',
      key: 'id'
    }
  },
  job_title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  job_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  experience: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  qualifications: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  responsibilities: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  employment_type: {
    type: DataTypes.ENUM('Full-time', 'Part-time', 'Internship', 'Contract'),
    allowNull: true
  },
  salary: {
    type: DataTypes.STRING(100),
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
  posted_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Draft',
    validate: {
      isIn: [['Draft', 'Posted', 'Archive']]
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
  tableName: 'recruiter_jobs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = RecruiterJob; 