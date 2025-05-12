const express = require('express');
const router = express.Router();
const preferenceController = require('../controllers/preferenceController');
const { protect, checkRole } = require('../middleware/authMiddleware');

// Private routes - Student only
router.get('/', protect, checkRole(['student']), preferenceController.getMyPreferences);
router.post('/', protect, checkRole(['student']), preferenceController.createUpdatePreferences);
router.delete('/:id', protect, checkRole(['student']), preferenceController.deletePreference);

// Admin routes
router.get('/all', protect, checkRole(['admin']), preferenceController.getAllPreferences);

module.exports = router;
