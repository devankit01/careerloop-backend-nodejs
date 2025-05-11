const JobProfile = require('../models/JobProfile');
const sequelize = require('../config/dbConfig');
const { Op } = require('sequelize');

// @desc    Get all job profiles
// @route   GET /api/job-profiles
// @access  Public
exports.getAllJobProfiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const offset = (page - 1) * limit;
    
    const { count, rows: jobProfiles } = await JobProfile.findAndCountAll({
      limit,
      offset,
      order: [['category', 'ASC'], ['subcategory', 'ASC'], ['job_title', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: jobProfiles
    });
  } catch (error) {
    console.error('Error fetching job profiles:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get job profile by ID
// @route   GET /api/job-profiles/:id
// @access  Public
exports.getJobProfileById = async (req, res) => {
  try {
    const jobProfile = await JobProfile.findByPk(req.params.id);
    
    if (!jobProfile) {
      return res.status(404).json({
        success: false,
        message: 'Job profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: jobProfile
    });
  } catch (error) {
    console.error('Error fetching job profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Search job profiles for autocomplete
// @route   GET /api/job-profiles/search
// @access  Public
exports.searchJobProfiles = async (req, res) => {
  try {
    const { q, category, subcategory, limit: queryLimit } = req.query;
    const limit = parseInt(queryLimit, 10) || 10; // Default to 10 results for autocomplete
    
    // Build the where clause for the search
    const whereClause = {};
    
    // If search query exists, search primarily in job_title field with highest priority,
    // and also extend search to category and subcategory fields with lower priority
    if (q && q.trim() !== '') {
      const searchTerm = q.trim();
      whereClause[Op.or] = [
        // PRIMARY SEARCH: job_title field with two levels of priority
        // 1. Highest priority: job titles that START with the search term
        { job_title: { [Op.like]: `${searchTerm}%` } },
        // 2. High priority: job titles that CONTAIN the search term anywhere
        { job_title: { [Op.like]: `%${searchTerm}%` } },
        // EXTENDED SEARCH: category and subcategory fields with lower priority
        { category: { [Op.like]: `%${searchTerm}%` } },
        { subcategory: { [Op.like]: `%${searchTerm}%` } }
      ];
    }
    
    // Filter by category if provided
    if (category) {
      whereClause.category = { [Op.like]: `%${category}%` };
    }
    
    // Filter by subcategory if provided
    if (subcategory) {
      whereClause.subcategory = { [Op.like]: `%${subcategory}%` };
    }
    
    // Execute the query with optimized settings for autocomplete
    const jobProfiles = await JobProfile.findAll({
      where: whereClause,
      limit,
      attributes: ['id', 'category', 'subcategory', 'job_title'], // Return all fields
      order: [
        // Order by exact match in job_title first, then alphabetically
        [q ? sequelize.literal(`CASE 
          WHEN job_title LIKE '${q}%' THEN 0 
          WHEN job_title LIKE '%${q}%' THEN 1
          WHEN category LIKE '%${q}%' THEN 2
          WHEN subcategory LIKE '%${q}%' THEN 3
          ELSE 4 END`) : 'job_title', 'ASC'],
        ['category', 'ASC'],
        ['subcategory', 'ASC'],
        ['job_title', 'ASC']
      ]
    });
    
    // Format response for easier consumption by frontend autocomplete
    const formattedJobProfiles = jobProfiles.map(profile => ({
      id: profile.id,
      job_title: profile.job_title,
      category: profile.category,
      subcategory: profile.subcategory,
      display: `${profile.job_title} (${profile.subcategory} - ${profile.category})`
    }));
    
    // Return a simplified response optimized for autocomplete
    res.status(200).json({
      success: true,
      data: formattedJobProfiles
    });
  } catch (error) {
    console.error('Error searching job profiles for autocomplete:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
