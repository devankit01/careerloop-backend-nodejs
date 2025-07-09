const express = require('express');
const router = express.Router();
const noteController = require('../controllers/notesController');
const { protect, checkRole } = require('../middleware/authMiddleware');

// GET all notes for a specific job & jobseeker
router.get('/:jobseekerId/:jobId', protect, checkRole(['student']), noteController.getNotesByJob);

// CREATE a note
router.post('/', protect, checkRole(['student']), noteController.createNote);

// UPDATE a note
router.put('/:id', protect, checkRole(['student']), noteController.updateNote);

// DELETE a note
router.delete('/:id', protect, checkRole(['student']), noteController.deleteNote);

module.exports = router;


