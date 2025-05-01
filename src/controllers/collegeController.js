const College = require('../models/College');
const { Op } = require('sequelize');

/**
 * @desc    Get all colleges
 * @route   GET /api/colleges
 * @access  Public
 */
exports.getAllColleges = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { name, city, state, country, college_type, min_rating, max_fees } = req.query;
    
    // Build filter conditions
    const whereClause = {};
    
    if (name) {
      whereClause.college_name = { [Op.like]: `%${name}%` };
    }
    
    if (city) {
      whereClause.city = { [Op.like]: `%${city}%` };
    }
    
    if (state) {
      whereClause.state = { [Op.like]: `%${state}%` };
    }
    
    if (country) {
      whereClause.country = { [Op.like]: `%${country}%` };
    }
    
    if (college_type) {
      whereClause.college_type = { [Op.like]: `%${college_type}%` };
    }
    
    if (min_rating) {
      whereClause.rating = { [Op.gte]: parseFloat(min_rating) };
    }
    
    if (max_fees) {
      whereClause.average_fees_annual = { [Op.lte]: parseFloat(max_fees) };
    }
    
    const { count, rows } = await College.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['college_name', 'ASC']]
    });
    
    res.json({
      success: true,
      count,
      page,
      pages: Math.ceil(count / limit),
      data: rows
    });
  } catch (error) {
    console.error('Get all colleges error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get colleges',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

/**
 * @desc    Get college by ID
 * @route   GET /api/colleges/:id
 * @access  Public
 */
exports.getCollegeById = async (req, res) => {
  try {
    const college = await College.findByPk(req.params.id);
    
    if (college) {
      res.json({
        success: true,
        data: college
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }
  } catch (error) {
    console.error('Get college by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get college',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

/**
 * @desc    Create a new college
 * @route   POST /api/colleges
 * @access  Private/Admin
 */
exports.createCollege = async (req, res) => {
  try {
    const {
      college_name,
      genders_accepted,
      campus_size_acres,
      total_student_enrollments,
      total_faculty,
      established_year,
      rating,
      university,
      courses,
      facilities,
      city,
      state,
      country,
      college_type,
      average_fees_annual
    } = req.body;
    
    // Validate required fields
    if (!college_name || !genders_accepted || !city || !country || !college_type) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields'
      });
    }
    
    // Check if college already exists
    const collegeExists = await College.findOne({
      where: {
        college_name,
        city,
        country
      }
    });
    
    if (collegeExists) {
      return res.status(400).json({
        success: false,
        message: 'College with this name in this city already exists'
      });
    }
    
    // Create college
    const college = await College.create({
      college_name,
      genders_accepted,
      campus_size_acres,
      total_student_enrollments,
      total_faculty,
      established_year,
      rating,
      university,
      courses,
      facilities,
      city,
      state,
      country,
      college_type,
      average_fees_annual
    });
    
    if (college) {
      res.status(201).json({
        success: true,
        data: college
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid college data'
      });
    }
  } catch (error) {
    console.error('Create college error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create college',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

/**
 * @desc    Update college
 * @route   PUT /api/colleges/:id
 * @access  Private/Admin
 */
exports.updateCollege = async (req, res) => {
  try {
    const college = await College.findByPk(req.params.id);
    
    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }
    
    // Update college with request body
    const updatedCollege = await college.update({
      ...req.body
    });
    
    res.json({
      success: true,
      data: updatedCollege
    });
  } catch (error) {
    console.error('Update college error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update college',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

/**
 * @desc    Delete college
 * @route   DELETE /api/colleges/:id
 * @access  Private/Admin
 */
exports.deleteCollege = async (req, res) => {
  try {
    const college = await College.findByPk(req.params.id);
    
    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }
    
    await college.destroy();
    
    res.json({
      success: true,
      message: 'College removed'
    });
  } catch (error) {
    console.error('Delete college error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete college',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

/**
 * @desc    Search colleges
 * @route   GET /api/colleges/search
 * @access  Public
 */
exports.searchColleges = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const colleges = await College.findAll({
      where: {
        [Op.or]: [
          { college_name: { [Op.like]: `%${query}%` } },
          { university: { [Op.like]: `%${query}%` } },
          { city: { [Op.like]: `%${query}%` } },
          { state: { [Op.like]: `%${query}%` } },
          { country: { [Op.like]: `%${query}%` } },
          { college_type: { [Op.like]: `%${query}%` } }
        ]
      },
      limit: 20
    });
    
    res.json({
      success: true,
      count: colleges.length,
      data: colleges
    });
  } catch (error) {
    console.error('Search colleges error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search colleges',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
}; 