const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// Public routes - only GET routes
router.get('/', locationController.getAllLocations);
router.get('/search', locationController.searchLocations);
router.get('/:id', locationController.getLocationById);

module.exports = router;
