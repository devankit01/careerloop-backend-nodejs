const express = require('express');
const router = express.Router();
const recruiterJobController = require('../controllers/recruiterJobController');
const jobApplicationController = require('../controllers/jobApplicationController');
const recruiterCompanyProfileController = require('../controllers/recruiterCompanyProfileController');
const { protect, checkRole } = require('../middleware/authMiddleware');

// @route   GET /api/jobs
// @desc    Get all published jobs
// @access  Public
router.get('/', recruiterJobController.getAllPublishedJobs);

// @route   GET /api/jobs/:id
// @desc    Get job by ID (if published)
// @access  Public
router.get('/:id', recruiterJobController.getJobById);

// @route   POST /api/jobs/:id/apply
// @desc    Apply for a job
// @access  Private (Student only)
router.post('/:id/apply', protect, checkRole(['student']), jobApplicationController.applyForJob);

// @route   GET /api/jobs/company/:id
// @desc    Get company profile by ID
// @access  Public
router.get('/company/:id', recruiterCompanyProfileController.getCompanyProfileById);

module.exports = router; 