const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const RecruiterCompanyProfile = sequelize.define('RecruiterCompanyProfile', {
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
  company_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  website: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  industry: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  company_size: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  headquarters: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  founded_year: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  logo_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  social_links: {
    type: DataTypes.STRING(255),
    allowNull: true
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
  tableName: 'recruiter_company_profiles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = RecruiterCompanyProfile; 