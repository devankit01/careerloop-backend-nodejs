const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, admin, isActive, checkRole } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Route for social login users to set role
router.post('/set-role', protect, userController.setSocialUserRole);

// Private routes - User must be authenticated
router.get('/profile', protect, userController.getUserProfile);
router.put('/profile', protect, userController.updateUserProfile);

// Admin routes - Only admin can access
router.get('/', protect, checkRole(['admin']), userController.getUsers);
router.get('/:id', protect, checkRole(['admin']), userController.getUserById);
router.put('/:id', protect, checkRole(['admin']), userController.updateUser);
router.delete('/:id', protect, checkRole(['admin']), userController.deleteUser);

// Recruiter specific routes
router.get('/recruiter/dashboard', protect, checkRole(['recruiter']), (req, res) => {
  res.json({
    success: true,
    message: 'Recruiter dashboard'
  });
});

// Student specific routes
router.get('/student/dashboard', protect, checkRole(['student']), (req, res) => {
  res.json({
    success: true,
    message: 'Student dashboard'
  });
});

module.exports = router; 