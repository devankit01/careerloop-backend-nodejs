const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const WorkExperience = sequelize.define('WorkExperience', {
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
  company_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  position: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_current: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
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
  tableName: 'work_experiences',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Note: Associations are now defined in src/config/dbInit.js

module.exports = WorkExperience; 