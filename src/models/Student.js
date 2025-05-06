const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('./User');

const Student = sequelize.define('Student', {
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
  phone: {
    type: DataTypes.STRING(255),
    allowNull: true,
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
  degree: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  graduation_year: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  skills: {
    type: DataTypes.STRING(255),
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('skills');
      return rawValue ? rawValue.split(',') : [];
    },
    set(val) {
      if (Array.isArray(val)) {
        this.setDataValue('skills', val.join(','));
      } else {
        this.setDataValue('skills', val);
      }
    }
  },
  eresume_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  profile_picture: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  professional_summary: {
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
  tableName: 'students',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Note: Associations are now defined in src/config/dbInit.js

module.exports = Student; 