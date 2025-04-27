const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Recruiter = sequelize.define('Recruiter', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true
  },
  gender: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  dob: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  bio: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  social_media_links: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  profile_picture: {
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
  tableName: 'recruiters',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Note: Associations are defined in src/config/dbInit.js

module.exports = Recruiter; 