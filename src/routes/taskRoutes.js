const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect, checkRole } = require('../middleware/authMiddleware');

// GET all task for a specific job & jobseeker
router.get('/:jobseekerId/:jobId', protect, checkRole(['student']), taskController.getTasks);

// CREATE a task
router.post('/', protect, checkRole(['student']), taskController.addTask);

// UPDATE a task
router.put('/:id', protect, checkRole(['student']), taskController.updateTask);

// DELETE a task
router.delete('/:id', protect, checkRole(['student']), taskController.deleteTask);

module.exports = router;