const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const ProjectExperience = sequelize.define('ProjectExperience', {
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
  project_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  technologies: {
    type: DataTypes.STRING(255),
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('technologies');
      return rawValue ? rawValue.split(',') : [];
    },
    set(val) {
      if (Array.isArray(val)) {
        this.setDataValue('technologies', val.join(','));
      } else {
        this.setDataValue('technologies', val);
      }
    }
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
  project_url: {
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
  tableName: 'project_experiences',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Note: Associations are now defined in src/config/dbInit.js

module.exports = ProjectExperience; 