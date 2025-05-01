const RecruiterJob = require('../models/RecruiterJob');
const Recruiter = require('../models/Recruiter');
const User = require('../models/User');

// @desc    Create a job
// @route   POST /api/recruiters/jobs
// @access  Private (Recruiter only)
exports.createJob = async (req, res) => {
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

    // Create the job
    const job = await RecruiterJob.create({
      recruiter_id: recruiter.id,
      job_title: req.body.job_title,
      job_description: req.body.job_description,
      experience: req.body.experience,
      qualifications: req.body.qualifications,
      responsibilities: req.body.responsibilities,
      location: req.body.location,
      employment_type: req.body.employment_type,
      salary: req.body.salary,
      skills: req.body.skills,
      perks: req.body.perks,
      status: req.body.status || 'Draft'
    });

    res.status(201).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create job',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Get all jobs by recruiter
// @route   GET /api/recruiters/jobs
// @access  Private (Recruiter only)
exports.getJobs = async (req, res) => {
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

    // Get all jobs
    const jobs = await RecruiterJob.findAll({
      where: { recruiter_id: recruiter.id },
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get jobs',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Get job by ID
// @route   GET /api/recruiters/jobs/:id
// @access  Private
exports.getJobById = async (req, res) => {
  try {
    const job = await RecruiterJob.findByPk(req.params.id, {
      include: [
        {
          model: Recruiter,
          as: 'recruiter',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'first_name', 'last_name', 'email']
            }
          ]
        }
      ]
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Public route check
    if (!req.user) {
      // For public access, job must be posted
      if (job.status !== 'Posted') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    } else {
      // If authenticated user is not recruiter, job must be posted
      if (req.user.role !== 'recruiter' && job.status !== 'Posted') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      // If user is recruiter but not the job owner, job must be posted
      if (
        req.user.role === 'recruiter' && 
        job.recruiter.user_id !== req.user.id && 
        job.status !== 'Posted'
      ) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get job',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Update job
// @route   PUT /api/recruiters/jobs/:id
// @access  Private (Recruiter only - own jobs)
exports.updateJob = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the job
    const job = await RecruiterJob.findByPk(req.params.id, {
      include: [
        {
          model: Recruiter,
          as: 'recruiter',
          attributes: ['id', 'user_id']
        }
      ]
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.recruiter.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update the job
    await job.update({
      job_title: req.body.job_title || job.job_title,
      job_description: req.body.job_description || job.job_description,
      experience: req.body.experience || job.experience,
      qualifications: req.body.qualifications || job.qualifications,
      responsibilities: req.body.responsibilities || job.responsibilities,
      location: req.body.location || job.location,
      employment_type: req.body.employment_type || job.employment_type,
      salary: req.body.salary || job.salary,
      skills: req.body.skills || job.skills,
      perks: req.body.perks || job.perks,
      status: req.body.status || job.status
    });

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update job',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/recruiters/jobs/:id
// @access  Private (Recruiter only - own jobs)
exports.deleteJob = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the job
    const job = await RecruiterJob.findByPk(req.params.id, {
      include: [
        {
          model: Recruiter,
          as: 'recruiter',
          attributes: ['id', 'user_id']
        }
      ]
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.recruiter.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Delete the job
    await job.destroy();

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Get all published jobs
// @route   GET /api/jobs
// @access  Public
exports.getAllPublishedJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get all published jobs
    const { count, rows: jobs } = await RecruiterJob.findAndCountAll({
      where: { status: 'Posted' },
      include: [
        {
          model: Recruiter,
          as: 'recruiter',
          attributes: ['id'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'first_name', 'last_name']
            }
          ]
        }
      ],
      limit,
      offset,
      order: [['posted_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        jobs,
        page,
        pages: Math.ceil(count / limit),
        total: count
      }
    });
  } catch (error) {
    console.error('Get all published jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get jobs',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
}; 