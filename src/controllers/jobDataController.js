const JobData = require('../models/JobData');
const sequelize = require('../config/dbConfig');
const { Op } = require('sequelize');

// @desc    Search jobs by title and location
// @route   GET /api/job-data/search
// @access  Public
exports.searchJobs = async (req, res) => {
  try {
    const { job_title, location, job_type } = req.query;
    
    // Build the where clause for search
    const whereClause = {};
    
    // Search by job title if provided
    if (job_title) {
      whereClause.job_title = {
        [Op.like]: `%${job_title}%`
      };
    }
    
    // Search by location if provided
    if (location) {
      // Split location into parts and search for each part to improve matching
      const locationParts = location.split(/[,\s]+/).filter(part => part.trim().length > 0);
      
      if (locationParts.length > 0) {
        const locationConditions = locationParts.map(part => ({
          location: { [Op.like]: `%${part}%` }
        }));
        
        // Add location conditions to where clause
        whereClause[Op.and] = whereClause[Op.and] || [];
        whereClause[Op.and].push({ [Op.or]: locationConditions });
      }
    }
    
    // Filter by job type if provided
    if (job_type) {
      whereClause.job_type = {
        [Op.like]: `%${job_type}%`
      };
    }
    
    // Execute the search query without pagination
    const jobs = await JobData.findAll({
      where: whereClause,
      order: [
        ['created_at', 'DESC']
      ]
    });
    
    // Return the search results
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error('Error searching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
