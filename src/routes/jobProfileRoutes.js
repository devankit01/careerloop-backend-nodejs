const express = require('express');
const router = express.Router();
const jobProfileController = require('../controllers/jobProfileController');

// Public routes - only GET routes
router.get('/', jobProfileController.getAllJobProfiles);
router.get('/search', jobProfileController.searchJobProfiles);
router.get('/:id', jobProfileController.getJobProfileById);

module.exports = router;
