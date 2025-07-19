const Task = require('../models/Task');
const Student = require('../models/Student');
const ImportedJob = require('../models/ImportedJob');

async function getStudentByUserId(userId) {
  return await Student.findOne({ where: { user_id: userId } });
}

// @desc    Add task
exports.addTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const student = await getStudentByUserId(userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found. Please create a profile first.',
        error: null
      });
    }

    if (!req.body.text) {
      return res.status(400).json({
        success: false,
        message: 'Task text is required.',
        error: null
      });
    }

    const task = await Task.create({
      jobseeker_id: student.id,
      text: req.body.text,
      is_done: req.body.is_done || false,
      imported_job_id: req.body.imported_job_id || null
    });

    res.status(201).json({
      success: true,
      data: task,
      error: null
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

// @desc    Get job Specific tasks for a student
exports.getTasks = async (req, res) => {
  try {
       const { jobId } = req.params;
    const userId = req.user.id;
    const student = await getStudentByUserId(userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
        error: null
      });
    }

    const tasks = await Task.findAll({
      where: { jobseeker_id: student.id , imported_job_id: jobId },
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
      data: tasks,
      error: null
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
exports.updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = Number(req.params.id);
    const student = await getStudentByUserId(userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
        error: null
      });
    }

    const task = await Task.findOne({
      where: {
        id: taskId,
        jobseeker_id: student.id
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or not authorized',
        error: null
      });
    }

    await task.update({
      text: req.body.text || task.text,
      is_done: req.body.is_done !== undefined ? req.body.is_done : task.is_done,
      imported_job_id: req.body.imported_job_id !== undefined ? req.body.imported_job_id : task.imported_job_id
    });

    await task.reload();

    res.json({
      success: true,
      data: task,
      error: null
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
exports.deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = Number(req.params.id);
    const student = await getStudentByUserId(userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
        error: null
      });
    }

    const task = await Task.findOne({
      where: {
        id: taskId,
        jobseeker_id: student.id
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or not authorized',
        error: null
      });
    }

    await task.destroy();

    res.json({
      success: true,
      message: 'Task removed successfully',
      error: null
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
