const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Preference = sequelize.define('Preference', {
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
  skills:{
    type:DataTypes.JSON,
    allowNull:true
  },
  location:{
    type:DataTypes.STRING,
    allowNull:true,
  },
  job_experience:{
    type:DataTypes.INTEGER,
    allowNull:true,
    defaultValue: 0,
  },

  job_type: {
    type: DataTypes.JSON, 
    allowNull: true
  },
  job_function: {
    type: DataTypes.JSON, 
    allowNull: true
  },
  weekly_goal: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Number of jobs the user wants to apply for weekly'
  },
  streak: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    comment: 'Current streak count of meeting weekly goals'
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
  tableName: 'preferences',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Note: Associations are defined in src/config/dbInit.js

module.exports = Preference;
