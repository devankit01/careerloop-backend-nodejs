const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const jobApplicationController = require('../controllers/jobApplicationController');
const { protect, checkRole, isActive } = require('../middleware/authMiddleware');

// Public routes
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);

// Private routes - Student only
router.post('/profile', protect, checkRole(['student']), studentController.createUpdateStudentProfile);
router.get('/profile/me', protect, checkRole(['student']), studentController.getStudentProfile);

// Job application routes
router.get('/applications', protect, checkRole(['student']), jobApplicationController.getStudentApplications);

// Education routes
router.post('/education', protect, checkRole(['student']), studentController.addEducation);
router.put('/education/:id', protect, checkRole(['student']), studentController.updateEducation);
router.delete('/education/:id', protect, checkRole(['student']), studentController.deleteEducation);

// Work Experience routes
router.post('/work-experience', protect, checkRole(['student']), studentController.addWorkExperience);
router.put('/work-experience/:id', protect, checkRole(['student']), studentController.updateWorkExperience);
router.delete('/work-experience/:id', protect, checkRole(['student']), studentController.deleteWorkExperience);

// Project Experience routes
router.post('/project-experience', protect, checkRole(['student']), studentController.addProjectExperience);
router.put('/project-experience/:id', protect, checkRole(['student']), studentController.updateProjectExperience);
router.delete('/project-experience/:id', protect, checkRole(['student']), studentController.deleteProjectExperience);

// Certification routes
router.post('/certification', protect, checkRole(['student']), studentController.addCertification);
router.put('/certification/:id', protect, checkRole(['student']), studentController.updateCertification);
router.delete('/certification/:id', protect, checkRole(['student']), studentController.deleteCertification);

module.exports = router; 