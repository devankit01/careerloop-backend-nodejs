const Recruiter = require('../models/Recruiter');
const User = require('../models/User');

// @desc    Get recruiter profile
// @route   GET /api/recruiters/profile
// @access  Private (Recruiter only)
exports.getRecruiterProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the recruiter profile
    const recruiter = await Recruiter.findOne({
      where: { user_id: userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email', 'role']
        }
      ]
    });

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }

    res.json({
      success: true,
      data: recruiter
    });
  } catch (error) {
    console.error('Get recruiter profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recruiter profile',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Create recruiter profile
// @route   POST /api/recruiters/profile
// @access  Private (Recruiter only)
exports.createRecruiterProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if profile already exists
    const existingProfile = await Recruiter.findOne({ where: { user_id: userId } });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Recruiter profile already exists'
      });
    }

    // Validate company_id if provided
    if (req.body.company_id && isNaN(Number(req.body.company_id))) {
      return res.status(400).json({
        success: false,
        message: 'Company ID must be a number'
      });
    }

    // Create profile
    const recruiterProfile = await Recruiter.create({
      user_id: userId,
      company_id: req.body.company_id,
      phone: req.body.phone,
      gender: req.body.gender,
      dob: req.body.dob,
      bio: req.body.bio,
      location: req.body.location,
      social_media_links: req.body.social_media_links,
      profile_picture: req.body.profile_picture
    });

    res.status(201).json({
      success: true,
      data: recruiterProfile
    });
  } catch (error) {
    console.error('Create recruiter profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create recruiter profile',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Update recruiter profile
// @route   PUT /api/recruiters/profile
// @access  Private (Recruiter only)
exports.updateRecruiterProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the recruiter profile
    const recruiter = await Recruiter.findOne({ where: { user_id: userId } });
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }

    // Validate company_id if provided
    if (req.body.company_id !== undefined && isNaN(Number(req.body.company_id))) {
      return res.status(400).json({
        success: false,
        message: 'Company ID must be a number'
      });
    }

    // Update profile
    await recruiter.update({
      company_id: req.body.company_id !== undefined ? req.body.company_id : recruiter.company_id,
      phone: req.body.phone !== undefined ? req.body.phone : recruiter.phone,
      gender: req.body.gender !== undefined ? req.body.gender : recruiter.gender,
      dob: req.body.dob !== undefined ? req.body.dob : recruiter.dob,
      bio: req.body.bio !== undefined ? req.body.bio : recruiter.bio,
      location: req.body.location !== undefined ? req.body.location : recruiter.location,
      social_media_links: req.body.social_media_links !== undefined ? req.body.social_media_links : recruiter.social_media_links,
      profile_picture: req.body.profile_picture !== undefined ? req.body.profile_picture : recruiter.profile_picture
    });

    res.json({
      success: true,
      data: recruiter
    });
  } catch (error) {
    console.error('Update recruiter profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update recruiter profile',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Delete recruiter profile
// @route   DELETE /api/recruiters/profile
// @access  Private (Recruiter only)
exports.deleteRecruiterProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the recruiter profile
    const recruiter = await Recruiter.findOne({ where: { user_id: userId } });
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }

    // Delete the profile
    await recruiter.destroy();

    res.json({
      success: true,
      message: 'Recruiter profile deleted successfully'
    });
  } catch (error) {
    console.error('Delete recruiter profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete recruiter profile',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
}; 