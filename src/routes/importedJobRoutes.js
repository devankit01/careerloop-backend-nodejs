const express = require('express');
const router = express.Router();
const importedJobController = require('../controllers/importedJobController');
const { protect, checkRole } = require('../middleware/authMiddleware');

// All routes are protected for students only
router.post('/', protect, checkRole(['student']), importedJobController.addImportedJob);
router.get('/', protect, checkRole(['student']), importedJobController.getImportedJobs);
router.get('/:id', protect, checkRole(['student']), importedJobController.getImportedJobById);
router.put('/:id', protect, checkRole(['student']), importedJobController.updateImportedJob);
router.delete('/:id', protect, checkRole(['student']), importedJobController.deleteImportedJob);

module.exports = router; 