const Note = require('../models/Note');
const Student = require('../models/Student');
const ImportedJob = require('../models/ImportedJob');

// @desc    Add note
// @route   POST /api/students/notes
// @access  Private (Student only)
exports.addNote = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get student profile
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found. Please create a profile first.'
      });
    }
    
    // Create note entry
    const note = await Note.create({
      jobseeker_id: student.id,
      text: req.body.text,
      imported_job_id: req.body.imported_job_id || null
    });
    
    res.status(201).json({
      success: true,
      data: note
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add note',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Get all notes for a student
// @route   GET /api/students/notes
// @access  Private (Student only)
exports.getNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get student profile
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Get notes
    const notes = await Note.findAll({
      where: { jobseeker_id: student.id },
      include: [
        {
          model: ImportedJob,
          as: 'importedJob',
          attributes: ['id', 'job_title', 'company_info']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      data: notes
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notes',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Update note
// @route   PUT /api/students/notes/:id
// @access  Private (Student only)
exports.updateNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.id;
    
    // Get student profile
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Find the note entry
    const note = await Note.findOne({
      where: {
        id: noteId,
        jobseeker_id: student.id
      }
    });
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found or not authorized'
      });
    }
    
    // Update note
    await note.update({
      text: req.body.text || note.text,
      imported_job_id: req.body.imported_job_id !== undefined ? req.body.imported_job_id : note.imported_job_id
    });
    
    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update note',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Delete note
// @route   DELETE /api/students/notes/:id
// @access  Private (Student only)
exports.deleteNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.id;
    
    // Get student profile
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Find and delete the note entry
    const note = await Note.findOne({
      where: {
        id: noteId,
        jobseeker_id: student.id
      }
    });
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found or not authorized'
      });
    }
    
    await note.destroy();
    
    res.json({
      success: true,
      message: 'Note removed successfully'
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete note',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
}; 