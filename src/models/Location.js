const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Location = sequelize.define('Location', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  state_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  state_code: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  state_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  country_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  country_code: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  country_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true
  },
  wikiDataId: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'location_data',
  timestamps: false
});

module.exports = Location;
