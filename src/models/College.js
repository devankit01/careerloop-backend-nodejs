const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const College = sequelize.define('College', {
  college_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  college_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  genders_accepted: {
    type: DataTypes.ENUM('girls', 'boys', 'co-ed'),
    allowNull: false
  },
  campus_size_acres: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  total_student_enrollments: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  total_faculty: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  established_year: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1501
    }
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 5
    }
  },
  university: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  courses: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  facilities: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  college_type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  average_fees_annual: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    validate: {
      min: 0
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
  tableName: 'college_data',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = College; 