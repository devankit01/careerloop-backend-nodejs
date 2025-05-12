const Location = require('../models/Location');
const sequelize = require('../config/dbConfig');
const { Op } = require('sequelize');

// @desc    Get all locations
// @route   GET /api/locations
// @access  Public
exports.getAllLocations = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const offset = (page - 1) * limit;
    
    const { count, rows: locations } = await Location.findAndCountAll({
      limit,
      offset,
      order: [['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: locations
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get location by ID
// @route   GET /api/locations/:id
// @access  Public
exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: location
    });
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Search locations for autocomplete
// @route   GET /api/locations/search
// @access  Public
exports.searchLocations = async (req, res) => {
  try {
    const { q, country, state, limit: queryLimit } = req.query;
    const limit = parseInt(queryLimit, 10) || 10; // Default to 10 results for autocomplete
    
    // Build the where clause for the search
    const whereClause = {};
    
    // If search query exists, prioritize locations that start with the query
    // but also include locations that contain the query anywhere in the name
    if (q && q.trim() !== '') {
      const searchTerm = q.trim();
      whereClause[Op.or] = [
        // Higher priority: Names that start with the search term
        { name: { [Op.like]: `${searchTerm}%` } },
        // Lower priority: Names that contain the search term anywhere
        { name: { [Op.like]: `%${searchTerm}%` } }
      ];
    }
    
    // Filter by country if provided
    if (country) {
      whereClause.country_name = { [Op.like]: `%${country}%` };
    }
    
    // Filter by state if provided
    if (state) {
      whereClause.state_name = { [Op.like]: `%${state}%` };
    }
    
    // Execute the query with optimized settings for autocomplete
    const locations = await Location.findAll({
      where: whereClause,
      limit,
      attributes: ['id', 'name', 'state_name', 'country_name'], // Only return necessary fields
      order: [
        // Order by exact match first, then by name
        [q ? sequelize.literal(`CASE WHEN name LIKE '${q}%' THEN 0 ELSE 1 END`) : 'name', 'ASC'],
        ['name', 'ASC']
      ]
    });
    
    // Format response for easier consumption by frontend autocomplete
    const formattedLocations = locations.map(location => ({
      id: location.id,
      name: location.name,
      display: `${location.name}${location.state_name ? `, ${location.state_name}` : ''}${location.country_name ? `, ${location.country_name}` : ''}`
    }));
    
    // Return a simplified response optimized for autocomplete
    res.status(200).json({
      success: true,
      data: formattedLocations
    });
  } catch (error) {
    console.error('Error searching locations for autocomplete:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
