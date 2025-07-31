const JobData = require('../models/JobData');
const sequelize = require('../config/dbConfig');
const { Op } = require('sequelize');

// @desc    Search jobs by title and location
// @route   GET /api/job-data/search
// @access  Public
exports.searchJobs = async (req, res) => {
  try {
    const { job_title, location, job_type } = req.query;

    // Pagination setup
    const page = parseInt(req.query.page) || 1; // Get page from query, default to 1
    const limit = 10; // Items per page
    const offset = (page - 1) * limit; // Calculate offset

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
      const locationParts = location.split(/[,\s]+/).filter(part => part.trim().length > 0);

      if (locationParts.length > 0) {
        // Create an array of OR conditions for each part of the location
        const locationConditions = locationParts.map(part => ({
          location: { [Op.like]: `%${part}%` }
        }));

        // Add the OR condition to the whereClause
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

    console.log('Final WHERE clause:', JSON.stringify(whereClause, null, 2));
    
    // Execute the search query with pagination and optimization
    const { rows: jobs, count: totalJobs } = await JobData.findAndCountAll({
      where: whereClause,
      order: [
        ['created_at', 'DESC']
      ],
      limit, // Apply limit for pagination
      offset, // Apply offset for pagination
    
      // Return only selected fields to reduce payload size
      attributes: [
        'id',
        'job_title',
        'location',
        'salary',
        'job_platform_name',
        'job_url',
        'created_at'
      ]    
    });

    // Return the paginated search results
    res.status(200).json({
      success: true,
      count: jobs.length,
      totalJobs,
      currentPage: page,
      totalPages: Math.ceil(totalJobs / limit),      
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
