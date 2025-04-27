const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const recruiterJobController = require('../controllers/recruiterJobController');
const recruiterCompanyProfileController = require('../controllers/recruiterCompanyProfileController');
const jobApplicationController = require('../controllers/jobApplicationController');
const { protect, checkRole } = require('../middleware/authMiddleware');

// Profile routes
// @route   GET /api/recruiters/profile
// @desc    Get recruiter profile
// @access  Private (Recruiter only)
router.get('/profile', protect, checkRole(['recruiter']), recruiterController.getRecruiterProfile);

// @route   POST /api/recruiters/profile
// @desc    Create recruiter profile
// @access  Private (Recruiter only)
router.post('/profile', protect, checkRole(['recruiter']), recruiterController.createRecruiterProfile);

// @route   PUT /api/recruiters/profile
// @desc    Update recruiter profile
// @access  Private (Recruiter only)
router.put('/profile', protect, checkRole(['recruiter']), recruiterController.updateRecruiterProfile);

// @route   DELETE /api/recruiters/profile
// @desc    Delete recruiter profile
// @access  Private (Recruiter only)
router.delete('/profile', protect, checkRole(['recruiter']), recruiterController.deleteRecruiterProfile);

// Company profile routes
// @route   GET /api/recruiters/company
// @desc    Get company profile
// @access  Private (Recruiter only)
router.get('/company', protect, checkRole(['recruiter']), recruiterCompanyProfileController.getCompanyProfile);

// @route   POST /api/recruiters/company
// @desc    Create or update company profile
// @access  Private (Recruiter only)
router.post('/company', protect, checkRole(['recruiter']), recruiterCompanyProfileController.createUpdateCompanyProfile);

// @route   DELETE /api/recruiters/company
// @desc    Delete company profile
// @access  Private (Recruiter only)
router.delete('/company', protect, checkRole(['recruiter']), recruiterCompanyProfileController.deleteCompanyProfile);

// Job routes
// @route   GET /api/recruiters/jobs
// @desc    Get all jobs by recruiter
// @access  Private (Recruiter only)
router.get('/jobs', protect, checkRole(['recruiter']), recruiterJobController.getJobs);

// @route   POST /api/recruiters/jobs
// @desc    Create a job
// @access  Private (Recruiter only)
router.post('/jobs', protect, checkRole(['recruiter']), recruiterJobController.createJob);

// @route   GET /api/recruiters/jobs/:id
// @desc    Get job by ID
// @access  Private
router.get('/jobs/:id', protect, recruiterJobController.getJobById);

// @route   PUT /api/recruiters/jobs/:id
// @desc    Update job
// @access  Private (Recruiter only - own jobs)
router.put('/jobs/:id', protect, checkRole(['recruiter']), recruiterJobController.updateJob);

// @route   DELETE /api/recruiters/jobs/:id
// @desc    Delete job
// @access  Private (Recruiter only - own jobs)
router.delete('/jobs/:id', protect, checkRole(['recruiter']), recruiterJobController.deleteJob);

// Job applications routes
// @route   GET /api/recruiters/jobs/:id/applications
// @desc    Get all applications for a job
// @access  Private (Recruiter only - own jobs)
router.get('/jobs/:id/applications', protect, checkRole(['recruiter']), jobApplicationController.getJobApplications);

// @route   PUT /api/recruiters/applications/:id
// @desc    Update application status
// @access  Private (Recruiter only - own jobs' applications)
router.put('/applications/:id', protect, checkRole(['recruiter']), jobApplicationController.updateApplicationStatus);

module.exports = router; 