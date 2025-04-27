const RecruiterJobApplication = require('../models/RecruiterJobApplication');
const RecruiterJob = require('../models/RecruiterJob');
const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');
const User = require('../models/User');

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private (Student only)
exports.applyForJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;

    // Check if the job exists and is posted
    const job = await RecruiterJob.findOne({
      where: { id: jobId, status: 'Posted' }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or not available for applications'
      });
    }

    // Find the student profile
    const student = await Student.findOne({ where: { user_id: userId } });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Check if already applied
    const existingApplication = await RecruiterJobApplication.findOne({
      where: {
        job_id: jobId,
        applicant_id: student.id
      }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Create application
    const application = await RecruiterJobApplication.create({
      job_id: jobId,
      applicant_id: student.id,
      application_status: 'Applied',
      applied_at: new Date()
    });

    res.status(201).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to apply for job',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Get all applications for a student
// @route   GET /api/students/applications
// @access  Private (Student only)
exports.getStudentApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the student profile
    const student = await Student.findOne({ where: { user_id: userId } });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Get all applications
    const applications = await RecruiterJobApplication.findAll({
      where: { applicant_id: student.id },
      include: [
        {
          model: RecruiterJob,
          as: 'job',
          include: [
            {
              model: Recruiter,
              as: 'recruiter',
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['id', 'name']
                }
              ]
            }
          ]
        }
      ],
      order: [['applied_at', 'DESC']]
    });

    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Get student applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get applications',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Get all applications for a job
// @route   GET /api/recruiters/jobs/:id/applications
// @access  Private (Recruiter only - own jobs)
exports.getJobApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;

    // Find the recruiter profile
    const recruiter = await Recruiter.findOne({ where: { user_id: userId } });
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }

    // Check if the job exists and belongs to the recruiter
    const job = await RecruiterJob.findOne({
      where: { id: jobId, recruiter_id: recruiter.id }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or access denied'
      });
    }

    // Get all applications
    const applications = await RecruiterJobApplication.findAll({
      where: { job_id: jobId },
      include: [
        {
          model: Student,
          as: 'applicant',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ],
      order: [['applied_at', 'DESC']]
    });

    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get applications',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Update application status
// @route   PUT /api/recruiters/applications/:id
// @access  Private (Recruiter only - own jobs' applications)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const applicationId = req.params.id;
    const { status } = req.body;

    // Check if status is valid
    const validStatuses = ['Applied', 'Reviewed', 'Interview', 'Rejected', 'Hired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Find the recruiter profile
    const recruiter = await Recruiter.findOne({ where: { user_id: userId } });
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }

    // Find the application
    const application = await RecruiterJobApplication.findByPk(applicationId, {
      include: [
        {
          model: RecruiterJob,
          as: 'job',
          attributes: ['id', 'recruiter_id']
        }
      ]
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if the job belongs to the recruiter
    if (application.job.recruiter_id !== recruiter.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update application status
    await application.update({
      application_status: status
    });

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
}; 