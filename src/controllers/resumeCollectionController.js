const ResumeCollection = require('../models/ResumeCollection');
const Student = require('../models/Student');

// @desc    Get all resume collections for current student
// @route   GET /api/resume-collections
// @access  Private (Student only)
exports.getMyResumeCollections = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // First get the student ID from the user ID
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    const resumeCollections = await ResumeCollection.findAll({
      where: { jobseeker_id: student.id },
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      data: resumeCollections
    });
  } catch (error) {
    console.error('Get resume collections error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get resume collections',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Get resume collection by ID
// @route   GET /api/resume-collections/:id
// @access  Private (Student only)
exports.getResumeCollectionById = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumeCollectionId = req.params.id;
    
    // First get the student ID from the user ID
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    const resumeCollection = await ResumeCollection.findOne({
      where: { 
        id: resumeCollectionId,
        jobseeker_id: student.id 
      }
    });
    
    if (!resumeCollection) {
      return res.status(404).json({
        success: false,
        message: 'Resume collection not found'
      });
    }
    
    res.json({
      success: true,
      data: resumeCollection
    });
  } catch (error) {
    console.error('Get resume collection by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get resume collection',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Create new resume collection
// @route   POST /api/resume-collections
// @access  Private (Student only)
exports.createResumeCollection = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // First get the student ID from the user ID
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    const { title, json } = req.body;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }
    
    const resumeCollection = await ResumeCollection.create({
      title,
      json,
      jobseeker_id: student.id
    });
    
    res.status(201).json({
      success: true,
      data: resumeCollection
    });
  } catch (error) {
    console.error('Create resume collection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create resume collection',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Update resume collection
// @route   PUT /api/resume-collections/:id
// @access  Private (Student only)
exports.updateResumeCollection = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumeCollectionId = req.params.id;
    
    // First get the student ID from the user ID
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Check if the resume collection exists and belongs to this student
    let resumeCollection = await ResumeCollection.findOne({
      where: { 
        id: resumeCollectionId,
        jobseeker_id: student.id 
      }
    });
    
    if (!resumeCollection) {
      return res.status(404).json({
        success: false,
        message: 'Resume collection not found or you do not have permission to update it'
      });
    }
    
    const { title, json } = req.body;
    
    await resumeCollection.update({
      title: title || resumeCollection.title,
      json: json || resumeCollection.json
    });
    
    // Refetch the updated resume collection
    resumeCollection = await ResumeCollection.findByPk(resumeCollectionId);
    
    res.json({
      success: true,
      data: resumeCollection
    });
  } catch (error) {
    console.error('Update resume collection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update resume collection',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Delete resume collection
// @route   DELETE /api/resume-collections/:id
// @access  Private (Student only)
exports.deleteResumeCollection = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumeCollectionId = req.params.id;
    
    // First get the student ID from the user ID
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Check if the resume collection exists and belongs to this student
    const resumeCollection = await ResumeCollection.findOne({
      where: { 
        id: resumeCollectionId,
        jobseeker_id: student.id 
      }
    });
    
    if (!resumeCollection) {
      return res.status(404).json({
        success: false,
        message: 'Resume collection not found or you do not have permission to delete it'
      });
    }
    
    await resumeCollection.destroy();
    
    res.json({
      success: true,
      message: 'Resume collection deleted successfully'
    });
  } catch (error) {
    console.error('Delete resume collection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resume collection',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
}; 