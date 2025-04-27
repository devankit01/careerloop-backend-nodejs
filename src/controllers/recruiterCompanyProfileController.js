const RecruiterCompanyProfile = require('../models/RecruiterCompanyProfile');
const Recruiter = require('../models/Recruiter');
const User = require('../models/User');

// @desc    Create or update company profile
// @route   POST /api/recruiters/company
// @access  Private (Recruiter only)
exports.createUpdateCompanyProfile = async (req, res) => {
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

    // Check if company profile exists
    let companyProfile = await RecruiterCompanyProfile.findOne({
      where: { recruiter_id: recruiter.id }
    });

    const companyData = {
      company_name: req.body.company_name,
      website: req.body.website,
      industry: req.body.industry,
      company_size: req.body.company_size,
      headquarters: req.body.headquarters,
      founded_year: req.body.founded_year,
      description: req.body.description,
      logo_url: req.body.logo_url,
      social_links: req.body.social_links
    };

    if (companyProfile) {
      // Update existing profile
      await companyProfile.update(companyData);
    } else {
      // Create new profile
      companyProfile = await RecruiterCompanyProfile.create({
        recruiter_id: recruiter.id,
        ...companyData
      });
    }

    res.status(companyProfile ? 200 : 201).json({
      success: true,
      data: companyProfile
    });
  } catch (error) {
    console.error('Create/Update company profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create/update company profile',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Get company profile
// @route   GET /api/recruiters/company
// @access  Private (Recruiter only)
exports.getCompanyProfile = async (req, res) => {
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

    // Find the company profile
    const companyProfile = await RecruiterCompanyProfile.findOne({
      where: { recruiter_id: recruiter.id }
    });

    if (!companyProfile) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    res.json({
      success: true,
      data: companyProfile
    });
  } catch (error) {
    console.error('Get company profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get company profile',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Get company profile by ID
// @route   GET /api/recruiters/company/:id
// @access  Public
exports.getCompanyProfileById = async (req, res) => {
  try {
    const companyProfile = await RecruiterCompanyProfile.findByPk(req.params.id, {
      include: [
        {
          model: Recruiter,
          as: 'recruiter',
          attributes: ['id'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });

    if (!companyProfile) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    res.json({
      success: true,
      data: companyProfile
    });
  } catch (error) {
    console.error('Get company profile by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get company profile',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Delete company profile
// @route   DELETE /api/recruiters/company
// @access  Private (Recruiter only)
exports.deleteCompanyProfile = async (req, res) => {
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

    // Find the company profile
    const companyProfile = await RecruiterCompanyProfile.findOne({
      where: { recruiter_id: recruiter.id }
    });

    if (!companyProfile) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    // Delete the company profile
    await companyProfile.destroy();

    res.json({
      success: true,
      message: 'Company profile deleted successfully'
    });
  } catch (error) {
    console.error('Delete company profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete company profile',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
}; 