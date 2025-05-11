const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const JobProfile = sequelize.define('JobProfile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  subcategory: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  job_title: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'job_profiles',
  timestamps: false
});

module.exports = JobProfile;
