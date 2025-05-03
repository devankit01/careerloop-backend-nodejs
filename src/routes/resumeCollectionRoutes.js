const express = require('express');
const router = express.Router();
const resumeCollectionController = require('../controllers/resumeCollectionController');
const { protect, checkRole, isActive } = require('../middleware/authMiddleware');

// All routes are prefixed with /api/resume-collections

// Private routes - Student only
router.get('/', protect, checkRole(['student']), resumeCollectionController.getMyResumeCollections);
router.get('/:id', protect, checkRole(['student']), resumeCollectionController.getResumeCollectionById);
router.post('/', protect, checkRole(['student']), resumeCollectionController.createResumeCollection);
router.put('/:id', protect, checkRole(['student']), resumeCollectionController.updateResumeCollection);
router.delete('/:id', protect, checkRole(['student']), resumeCollectionController.deleteResumeCollection);

module.exports = router; 