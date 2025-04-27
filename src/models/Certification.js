const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Certification = sequelize.define('Certification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  issuing_organization: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  issue_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  expiration_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  credential_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  credential_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
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
  tableName: 'certifications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Note: Associations are now defined in src/config/dbInit.js

module.exports = Certification; 