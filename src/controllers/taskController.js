const Task = require('../models/Task');
const Student = require('../models/Student');
const ImportedJob = require('../models/ImportedJob');

// @desc    Add task
// @route   POST /api/students/tasks
// @access  Private (Student only)
exports.addTask = async (req, res) => {
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
    
    // Create task entry
    const task = await Task.create({
      jobseeker_id: student.id,
      text: req.body.text,
      is_done: req.body.is_done || false,
      imported_job_id: req.body.imported_job_id || null
    });
    
    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Add task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add task',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Get all tasks for a student
// @route   GET /api/students/tasks
// @access  Private (Student only)
exports.getTasks = async (req, res) => {
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
    
    // Get tasks
    const tasks = await Task.findAll({
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
      data: tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tasks',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Update task
// @route   PUT /api/students/tasks/:id
// @access  Private (Student only)
exports.updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    
    // Get student profile
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Find the task entry
    const task = await Task.findOne({
      where: {
        id: taskId,
        jobseeker_id: student.id
      }
    });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or not authorized'
      });
    }
    
    // Update task
    await task.update({
      text: req.body.text || task.text,
      is_done: req.body.is_done !== undefined ? req.body.is_done : task.is_done,
      imported_job_id: req.body.imported_job_id !== undefined ? req.body.imported_job_id : task.imported_job_id
    });
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/students/tasks/:id
// @access  Private (Student only)
exports.deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    
    // Get student profile
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Find and delete the task entry
    const task = await Task.findOne({
      where: {
        id: taskId,
        jobseeker_id: student.id
      }
    });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or not authorized'
      });
    }
    
    await task.destroy();
    
    res.json({
      success: true,
      message: 'Task removed successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
}; 