const ImportedJob = require('../models/ImportedJob');
const Student = require('../models/Student');
const Task = require('../models/Task');
const Note = require('../models/Note');
const Contact = require('../models/Contact');
const Document = require('../models/Document');

// @desc    Add imported job
// @route   POST /api/imported-jobs
// @access  Private (Student only)
exports.addImportedJob = async (req, res) => {
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
    
    // Create imported job entry
    const importedJob = await ImportedJob.create({
      jobseeker_id: student.id,
      job_title: req.body.job_title,
      job_location: req.body.job_location,
      company_info: req.body.company_info,
      job_url: req.body.job_url,
      salary: req.body.salary,
      roles_and_responsibilities: req.body.roles_and_responsibilities,
      description: req.body.description,
      skills: req.body.skills,
      perks: req.body.perks,
      imported_job_status: req.body.imported_job_status || 'New'
    });
    
    res.status(201).json({
      success: true,
      data: importedJob
    });
  } catch (error) {
    console.error('Add imported job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add imported job',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Get all imported jobs for a student
// @route   GET /api/imported-jobs
// @access  Private (Student only)
exports.getImportedJobs = async (req, res) => {
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
    
    // Get imported jobs
    const importedJobs = await ImportedJob.findAll({
      where: { jobseeker_id: student.id },
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      data: importedJobs
    });
  } catch (error) {
    console.error('Get imported jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get imported jobs',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Get imported job by ID
// @route   GET /api/imported-jobs/:id
// @access  Private (Student only)
exports.getImportedJobById = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;
    
    // Get student profile
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Find the imported job entry
    const importedJob = await ImportedJob.findOne({
      where: {
        id: jobId,
        jobseeker_id: student.id
      },
      include: [
        {
          model: Task,
          as: 'tasks'
        },
        {
          model: Note,
          as: 'notes'
        },
        {
          model: Contact,
          as: 'contacts'
        },
        {
          model: Document,
          as: 'documents'
        }
      ]
    });
    
    if (!importedJob) {
      return res.status(404).json({
        success: false,
        message: 'Imported job not found or not authorized'
      });
    }
    
    res.json({
      success: true,
      data: importedJob
    });
  } catch (error) {
    console.error('Get imported job by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get imported job',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Update imported job
// @route   PUT /api/imported-jobs/:id
// @access  Private (Student only)
exports.updateImportedJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;
    
    // Get student profile
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Find the imported job entry
    const importedJob = await ImportedJob.findOne({
      where: {
        id: jobId,
        jobseeker_id: student.id
      }
    });
    
    if (!importedJob) {
      return res.status(404).json({
        success: false,
        message: 'Imported job not found or not authorized'
      });
    }
    
    // Update imported job
    await importedJob.update({
      job_title: req.body.job_title || importedJob.job_title,
      job_location: req.body.job_location !== undefined ? req.body.job_location : importedJob.job_location,
      company_info: req.body.company_info !== undefined ? req.body.company_info : importedJob.company_info,
      job_url: req.body.job_url !== undefined ? req.body.job_url : importedJob.job_url,
      salary: req.body.salary !== undefined ? req.body.salary : importedJob.salary,
      roles_and_responsibilities: req.body.roles_and_responsibilities !== undefined ? req.body.roles_and_responsibilities : importedJob.roles_and_responsibilities,
      description: req.body.description !== undefined ? req.body.description : importedJob.description,
      skills: req.body.skills !== undefined ? req.body.skills : importedJob.skills,
      perks: req.body.perks !== undefined ? req.body.perks : importedJob.perks,
      imported_job_status: req.body.imported_job_status !== undefined ? req.body.imported_job_status : importedJob.imported_job_status
    });
    
    res.json({
      success: true,
      data: importedJob
    });
  } catch (error) {
    console.error('Update imported job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update imported job',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Delete imported job
// @route   DELETE /api/imported-jobs/:id
// @access  Private (Student only)
exports.deleteImportedJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;
    
    // Get student profile
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Find and delete the imported job entry
    const importedJob = await ImportedJob.findOne({
      where: {
        id: jobId,
        jobseeker_id: student.id
      }
    });
    
    if (!importedJob) {
      return res.status(404).json({
        success: false,
        message: 'Imported job not found or not authorized'
      });
    }
    
    await importedJob.destroy();
    
    res.json({
      success: true,
      message: 'Imported job removed successfully'
    });
  } catch (error) {
    console.error('Delete imported job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete imported job',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
}; 