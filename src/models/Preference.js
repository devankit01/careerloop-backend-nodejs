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
  job_type: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Comma-separated values: full-time, part-time, contract, internship',
    get() {
      const rawValue = this.getDataValue('job_type');
      return rawValue ? rawValue.split(',') : [];
    },
    set(val) {
      if (Array.isArray(val)) {
        this.setDataValue('job_type', val.join(','));
      } else {
        this.setDataValue('job_type', val);
      }
    }
  },
  job_function: {
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
  tableName: 'preferences',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Note: Associations are defined in src/config/dbInit.js

module.exports = Preference;
