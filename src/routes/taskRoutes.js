const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect, checkRole } = require('../middleware/authMiddleware');

// GET all notes for a specific job & jobseeker
router.get('/:jobseekerId/:jobId', protect, checkRole(['student']), taskController.getTasks);

// CREATE a note
router.post('/', protect, checkRole(['student']), taskController.addTask);

// UPDATE a note
router.put('/:id', protect, checkRole(['student']), taskController.updateTask);

// DELETE a note
router.delete('/:id', protect, checkRole(['student']), taskController.deleteTask);

module.exports = router;