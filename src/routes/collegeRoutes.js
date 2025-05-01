const express = require('express');
const router = express.Router();
const collegeController = require('../controllers/collegeController');
const { protect, checkRole } = require('../middleware/authMiddleware');

// Public routes
router.get('/', collegeController.getAllColleges);
router.get('/search', collegeController.searchColleges);
router.get('/:id', collegeController.getCollegeById);

// Admin routes
router.post('/', protect, checkRole(['admin']), collegeController.createCollege);
router.put('/:id', protect, checkRole(['admin']), collegeController.updateCollege);
router.delete('/:id', protect, checkRole(['admin']), collegeController.deleteCollege);

module.exports = router; 