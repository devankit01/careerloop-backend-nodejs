const Student = require('../models/Student');
const User = require('../models/User');
const Education = require('../models/Education');
const WorkExperience = require('../models/WorkExperience');
const ProjectExperience = require('../models/ProjectExperience');
const Certification = require('../models/Certification');
const AwardAchievement = require('../models/AwardAchievement');

// @desc    Create or update student profile
// @route   POST /api/students/profile
// @access  Private (Student only)
exports.createUpdateStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if student profile exists
    let student = await Student.findOne({ where: { user_id: userId } });
    
    const studentData = {
      phone: req.body.phone,
      gender: req.body.gender,
      dob: req.body.dob,
      bio: req.body.bio,
      location: req.body.location,
      social_media_links: req.body.social_media_links,
      degree: req.body.degree,
      graduation_year: req.body.graduation_year,
      skills: req.body.skills,
      eresume_url: req.body.eresume_url,
      profile_picture: req.body.profile_picture,
      professional_summary: req.body.professional_summary
    };
    
    if (student) {
      // Update existing profile
      await student.update(studentData);
    } else {
      // Create new profile
      student = await Student.create({
        user_id: userId,
        ...studentData
      });
    }
    
    // Fetch the updated student with user info
    const updatedStudent = await Student.findByPk(student.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'first_name', 'last_name', 'role', 'is_active']
        }
      ]
    });
    
    res.json({
      success: true,
      data: updatedStudent
    });
  } catch (error) {
    console.error('Student profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create/update student profile',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private
exports.getStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const student = await Student.findOne({
      where: { user_id: userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'first_name', 'last_name', 'role', 'is_active']
        },
        {
          model: Education,
          as: 'education'
        },
        {
          model: WorkExperience,
          as: 'workExperiences'
        },
        {
          model: ProjectExperience,
          as: 'projectExperiences'
        },
        {
          model: Certification,
          as: 'certifications'
        },
        {
          model: AwardAchievement,
          as: 'awardAchievements'
        }
      ]
    });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get student profile',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Get student profile by ID
// @route   GET /api/students/:id
// @access  Public
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'role']
        },
        {
          model: Education,
          as: 'education'
        },
        {
          model: WorkExperience,
          as: 'workExperiences'
        },
        {
          model: ProjectExperience,
          as: 'projectExperiences'
        },
        {
          model: Certification,
          as: 'certifications'
        },
        {
          model: AwardAchievement,
          as: 'awardAchievements'
        }
      ]
    });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Get student by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get student',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Get all students (with pagination)
// @route   GET /api/students
// @access  Public
exports.getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows: students } = await Student.findAndCountAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'role']
        }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      data: {
        students,
        page,
        pages: Math.ceil(count / limit),
        total: count
      }
    });
  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get students',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Add education to student profile
// @route   POST /api/students/education
// @access  Private (Student only)
exports.addEducation = async (req, res) => {
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
    
    // Create education entry
    const education = await Education.create({
      student_id: student.id,
      institution: req.body.institution,
      degree: req.body.degree,
      field_of_study: req.body.field_of_study,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      grade: req.body.grade,
      description: req.body.description
    });
    
    res.status(201).json({
      success: true,
      data: education
    });
  } catch (error) {
    console.error('Add education error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add education',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Update education
// @route   PUT /api/students/education/:id
// @access  Private (Student only)
exports.updateEducation = async (req, res) => {
  try {
    const userId = req.user.id;
    const educationId = req.params.id;
    
    // Get student profile
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Find the education entry
    const education = await Education.findOne({
      where: {
        id: educationId,
        student_id: student.id
      }
    });
    
    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education not found or not authorized'
      });
    }
    
    // Update education
    await education.update({
      institution: req.body.institution || education.institution,
      degree: req.body.degree || education.degree,
      field_of_study: req.body.field_of_study !== undefined ? req.body.field_of_study : education.field_of_study,
      start_date: req.body.start_date || education.start_date,
      end_date: req.body.end_date || education.end_date,
      grade: req.body.grade !== undefined ? req.body.grade : education.grade,
      description: req.body.description !== undefined ? req.body.description : education.description
    });
    
    res.json({
      success: true,
      data: education
    });
  } catch (error) {
    console.error('Update education error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update education',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Delete education
// @route   DELETE /api/students/education/:id
// @access  Private (Student only)
exports.deleteEducation = async (req, res) => {
  try {
    const userId = req.user.id;
    const educationId = req.params.id;
    
    // Get student profile
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Find and delete the education entry
    const education = await Education.findOne({
      where: {
        id: educationId,
        student_id: student.id
      }
    });
    
    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education not found or not authorized'
      });
    }
    
    await education.destroy();
    
    res.json({
      success: true,
      message: 'Education removed successfully'
    });
  } catch (error) {
    console.error('Delete education error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete education',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Add work experience to student profile
// @route   POST /api/students/work-experience
// @access  Private (Student only)
exports.addWorkExperience = async (req, res) => {
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
    
    // Create work experience entry
    const workExperience = await WorkExperience.create({
      student_id: student.id,
      company_name: req.body.company_name,
      position: req.body.position,
      location: req.body.location,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      is_current: req.body.is_current || false,
      description: req.body.description
    });
    
    res.status(201).json({
      success: true,
      data: workExperience
    });
  } catch (error) {
    console.error('Add work experience error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add work experience',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Update work experience
// @route   PUT /api/students/work-experience/:id
// @access  Private (Student only)
exports.updateWorkExperience = async (req, res) => {
  try {
    const userId = req.user.id;
    const workExperienceId = req.params.id;
    
    // Get student profile
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Find the work experience entry
    const workExperience = await WorkExperience.findOne({
      where: {
        id: workExperienceId,
        student_id: student.id
      }
    });
    
    if (!workExperience) {
      return res.status(404).json({
        success: false,
        message: 'Work experience not found or not authorized'
      });
    }
    
    // Update work experience
    await workExperience.update({
      company_name: req.body.company_name || workExperience.company_name,
      position: req.body.position || workExperience.position,
      location: req.body.location !== undefined ? req.body.location : workExperience.location,
      start_date: req.body.start_date || workExperience.start_date,
      end_date: req.body.end_date || workExperience.end_date,
      is_current: req.body.is_current !== undefined ? req.body.is_current : workExperience.is_current,
      description: req.body.description !== undefined ? req.body.description : workExperience.description
    });
    
    res.json({
      success: true,
      data: workExperience
    });
  } catch (error) {
    console.error('Update work experience error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update work experience',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Delete work experience
// @route   DELETE /api/students/work-experience/:id
// @access  Private (Student only)
exports.deleteWorkExperience = async (req, res) => {
  try {
    const userId = req.user.id;
    const workExperienceId = req.params.id;
    
    // Get student profile
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Find and delete the work experience entry
    const workExperience = await WorkExperience.findOne({
      where: {
        id: workExperienceId,
        student_id: student.id
      }
    });
    
    if (!workExperience) {
      return res.status(404).json({
        success: false,
        message: 'Work experience not found or not authorized'
      });
    }
    
    await workExperience.destroy();
    
    res.json({
      success: true,
      message: 'Work experience removed successfully'
    });
  } catch (error) {
    console.error('Delete work experience error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete work experience',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Add project experience to student profile
// @route   POST /api/students/project-experience
// @access  Private (Student only)
exports.addProjectExperience = async (req, res) => {
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
    
    // Create project experience entry
    const projectExperience = await ProjectExperience.create({
      student_id: student.id,
      project_name: req.body.project_name,
      role: req.body.role,
      technologies: req.body.technologies,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      is_current: req.body.is_current || false,
      description: req.body.description,
      project_url: req.body.project_url
    });
    
    res.status(201).json({
      success: true,
      data: projectExperience
    });
  } catch (error) {
    console.error('Add project experience error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add project experience',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Update project experience
// @route   PUT /api/students/project-experience/:id
// @access  Private (Student only)
exports.updateProjectExperience = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectExperienceId = req.params.id;
    
    // Get student profile
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Find the project experience entry
    const projectExperience = await ProjectExperience.findOne({
      where: {
        id: projectExperienceId,
        student_id: student.id
      }
    });
    
    if (!projectExperience) {
      return res.status(404).json({
        success: false,
        message: 'Project experience not found or not authorized'
      });
    }
    
    // Update project experience
    await projectExperience.update({
      project_name: req.body.project_name || projectExperience.project_name,
      role: req.body.role !== undefined ? req.body.role : projectExperience.role,
      technologies: req.body.technologies || projectExperience.technologies,
      start_date: req.body.start_date || projectExperience.start_date,
      end_date: req.body.end_date || projectExperience.end_date,
      is_current: req.body.is_current !== undefined ? req.body.is_current : projectExperience.is_current,
      description: req.body.description !== undefined ? req.body.description : projectExperience.description,
      project_url: req.body.project_url !== undefined ? req.body.project_url : projectExperience.project_url
    });
    
    res.json({
      success: true,
      data: projectExperience
    });
  } catch (error) {
    console.error('Update project experience error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project experience',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Delete project experience
// @route   DELETE /api/students/project-experience/:id
// @access  Private (Student only)
exports.deleteProjectExperience = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectExperienceId = req.params.id;
    
    // Get student profile
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Find and delete the project experience entry
    const projectExperience = await ProjectExperience.findOne({
      where: {
        id: projectExperienceId,
        student_id: student.id
      }
    });
    
    if (!projectExperience) {
      return res.status(404).json({
        success: false,
        message: 'Project experience not found or not authorized'
      });
    }
    
    await projectExperience.destroy();
    
    res.json({
      success: true,
      message: 'Project experience removed successfully'
    });
  } catch (error) {
    console.error('Delete project experience error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project experience',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Add certification to student profile
// @route   POST /api/students/certification
// @access  Private (Student only)
exports.addCertification = async (req, res) => {
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
    
    // Create certification entry
    const certification = await Certification.create({
      student_id: student.id,
      name: req.body.name,
      issuing_organization: req.body.issuing_organization,
      issue_date: req.body.issue_date,
      expiration_date: req.body.expiration_date,
      credential_id: req.body.credential_id,
      credential_url: req.body.credential_url,
      description: req.body.description
    });
    
    res.status(201).json({
      success: true,
      data: certification
    });
  } catch (error) {
    console.error('Add certification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add certification',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Update certification
// @route   PUT /api/students/certification/:id
// @access  Private (Student only)
exports.updateCertification = async (req, res) => {
  try {
    const userId = req.user.id;
    const certificationId = req.params.id;
    
    // Get student profile
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Find the certification entry
    const certification = await Certification.findOne({
      where: {
        id: certificationId,
        student_id: student.id
      }
    });
    
    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found or not authorized'
      });
    }
    
    // Update certification
    await certification.update({
      name: req.body.name || certification.name,
      issuing_organization: req.body.issuing_organization || certification.issuing_organization,
      issue_date: req.body.issue_date || certification.issue_date,
      expiration_date: req.body.expiration_date || certification.expiration_date,
      credential_id: req.body.credential_id !== undefined ? req.body.credential_id : certification.credential_id,
      credential_url: req.body.credential_url !== undefined ? req.body.credential_url : certification.credential_url,
      description: req.body.description !== undefined ? req.body.description : certification.description
    });
    
    res.json({
      success: true,
      data: certification
    });
  } catch (error) {
    console.error('Update certification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update certification',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Delete certification
// @route   DELETE /api/students/certification/:id
// @access  Private (Student only)
exports.deleteCertification = async (req, res) => {
  try {
    const userId = req.user.id;
    const certificationId = req.params.id;
    
    // Get student profile
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Find and delete the certification entry
    const certification = await Certification.findOne({
      where: {
        id: certificationId,
        student_id: student.id
      }
    });
    
    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found or not authorized'
      });
    }
    
    await certification.destroy();
    
    res.json({
      success: true,
      message: 'Certification removed successfully'
    });
  } catch (error) {
    console.error('Delete certification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete certification',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Add award/achievement
// @route   POST /api/students/award-achievement
// @access  Private (Student only)
exports.addAwardAchievement = async (req, res) => {
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
    
    const { title, issuer, description, date } = req.body;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }
    
    const awardAchievement = await AwardAchievement.create({
      title,
      issuer,
      description,
      date,
      jobseeker_id: student.id
    });
    
    res.status(201).json({
      success: true,
      data: awardAchievement
    });
  } catch (error) {
    console.error('Add award/achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add award/achievement',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Update award/achievement
// @route   PUT /api/students/award-achievement/:id
// @access  Private (Student only)
exports.updateAwardAchievement = async (req, res) => {
  try {
    const userId = req.user.id;
    const awardAchievementId = req.params.id;
    
    // First get the student ID from the user ID
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Check if the award/achievement exists and belongs to this student
    let awardAchievement = await AwardAchievement.findOne({
      where: { 
        id: awardAchievementId,
        jobseeker_id: student.id 
      }
    });
    
    if (!awardAchievement) {
      return res.status(404).json({
        success: false,
        message: 'Award/achievement not found or you do not have permission to update it'
      });
    }
    
    const { title, issuer, description, date } = req.body;
    
    await awardAchievement.update({
      title: title || awardAchievement.title,
      issuer: issuer !== undefined ? issuer : awardAchievement.issuer,
      description: description !== undefined ? description : awardAchievement.description,
      date: date !== undefined ? date : awardAchievement.date
    });
    
    // Refetch the updated award/achievement
    awardAchievement = await AwardAchievement.findByPk(awardAchievementId);
    
    res.json({
      success: true,
      data: awardAchievement
    });
  } catch (error) {
    console.error('Update award/achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update award/achievement',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Delete award/achievement
// @route   DELETE /api/students/award-achievement/:id
// @access  Private (Student only)
exports.deleteAwardAchievement = async (req, res) => {
  try {
    const userId = req.user.id;
    const awardAchievementId = req.params.id;
    
    // First get the student ID from the user ID
    const student = await Student.findOne({ where: { user_id: userId } });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Check if the award/achievement exists and belongs to this student
    const awardAchievement = await AwardAchievement.findOne({
      where: { 
        id: awardAchievementId,
        jobseeker_id: student.id 
      }
    });
    
    if (!awardAchievement) {
      return res.status(404).json({
        success: false,
        message: 'Award/achievement not found or you do not have permission to delete it'
      });
    }
    
    await awardAchievement.destroy();
    
    res.json({
      success: true,
      message: 'Award/achievement deleted successfully'
    });
  } catch (error) {
    console.error('Delete award/achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete award/achievement',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
}; 