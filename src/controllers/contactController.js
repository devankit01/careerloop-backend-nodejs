const Contact = require('../models/Contact');
const Student = require('../models/Student');
const ImportedJob = require('../models/ImportedJob');

// @desc    Add contact
// @route   POST /api/students/contacts
// @access  Private (Student only)
exports.addContact = async (req, res) => {
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
    
    // Create contact entry
    const contact = await Contact.create({
      jobseeker_id: student.id,
      tag: req.body.tag,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      social_media_links: req.body.social_media_links,
      company: req.body.company,
      job_title: req.body.job_title,
      job_location: req.body.job_location,
      imported_job_id: req.body.imported_job_id || null
    });
    
    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Add contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add contact',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Get all contacts for a student
// @route   GET /api/students/contacts
// @access  Private (Student only)
exports.getContacts = async (req, res) => {
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
    
    // Get contacts
    const contacts = await Contact.findAll({
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
      data: contacts
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get contacts',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Get contact by ID
// @route   GET /api/students/contacts/:id
// @access  Private (Student only)
exports.getContactById = async (req, res) => {
  try {
    const userId = req.user.id;
     const {jobId}  = req.params;
    // const contactId = req.params.id;
    
    // Get student profile
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Find the contact entry
    const contact = await Contact.findAll({
      where: {
        // id: contactId,
        jobseeker_id: student.id,
        imported_job_id:jobId 
      },
      include: [
        {
          model: ImportedJob,
          as: 'importedJob',
          attributes: ['id', 'job_title', 'company_info']
        }
      ]
    });
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found or not authorized'
      });
    }
    
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Get contact by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get contact',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Update contact
// @route   PUT /api/students/contacts/:id
// @access  Private (Student only)
exports.updateContact = async (req, res) => {
  try {
    const userId = req.user.id;
    const contactId = req.params.id;
    
    // Get student profile
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Find the contact entry
    const contact = await Contact.findOne({
      where: {
        id: contactId,
        jobseeker_id: student.id
      }
    });
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found or not authorized'
      });
    }
    
    // Update contact
    await contact.update({
      tag: req.body.tag !== undefined ? req.body.tag : contact.tag,
      first_name: req.body.first_name !== undefined ? req.body.first_name : contact.first_name,
      last_name: req.body.last_name !== undefined ? req.body.last_name : contact.last_name,
      email: req.body.email !== undefined ? req.body.email : contact.email,
      phone_number: req.body.phone_number !== undefined ? req.body.phone_number : contact.phone_number,
      social_media_links: req.body.social_media_links !== undefined ? req.body.social_media_links : contact.social_media_links,
      company: req.body.company !== undefined ? req.body.company : contact.company,
      job_title: req.body.job_title !== undefined ? req.body.job_title : contact.job_title,
      job_location: req.body.job_location !== undefined ? req.body.job_location : contact.job_location,
      imported_job_id: req.body.imported_job_id !== undefined ? req.body.imported_job_id : contact.imported_job_id
    });
    
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Delete contact
// @route   DELETE /api/students/contacts/:id
// @access  Private (Student only)
exports.deleteContact = async (req, res) => {
  try {
    const userId = req.user.id;
    const contactId = req.params.id;
    
    // Get student profile
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Find and delete the contact entry
    const contact = await Contact.findOne({
      where: {
        id: contactId,
        jobseeker_id: student.id
      }
    });
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found or not authorized'
      });
    }
    
    await contact.destroy();
    
    res.json({
      success: true,
      message: 'Contact removed successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
}; 