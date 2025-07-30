const express = require('express');
const router = express.Router();
const jobDataController = require('../controllers/jobDataController');
const { protect } = require('../middleware/authMiddleware');

// Search route - protected with authentication
router.get('/search', protect, jobDataController.searchJobs);
router.get('/:id', protect, jobDataController.searchJobswithId);


module.exports = router;
