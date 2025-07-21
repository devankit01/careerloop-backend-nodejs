const Preference = require('../models/Preference');
const Student = require('../models/Student');

// @desc    Get preferences for logged-in student
// @route   GET /api/preferences
// @access  Private (Student only)
exports.getMyPreferences = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.id } });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const preferences = await Preference.findAll({
      where: { student_id: student.id },
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: preferences
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create or update preferences
// @route   POST /api/preferences
// @access  Private (Student only)
exports.createUpdatePreferences = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.id } });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const { job_type, job_function, weekly_goal } = req.body;
    // console.log("Incoming job_type:", job_type);
    const cleanedJobType = Array.isArray(job_type) ? job_type : [];
    // console.log("cleanedJobType created:", cleanedJobType);
    const cleanedJobFunction = Array.isArray(job_function) ? job_function : [];
    // Find existing preference
    let preference = await Preference.findOne({ where: { student_id: student.id } });

    if (preference) {
      // Update existing preference
      const updatedPreference = {
        job_type: cleanedJobType.length > 0 ? cleanedJobType : preference.job_type,
        job_function: cleanedJobFunction.length > 0 ? cleanedJobFunction : preference.job_function,
        weekly_goal: weekly_goal !== undefined ? weekly_goal : preference.weekly_goal
      };

      preference = await preference.update(updatedPreference);
    } else {
      // Create new preference
      preference = await Preference.create({
        student_id: student.id,
        job_type: cleanedJobType,
        job_function: cleanedJobFunction,
        weekly_goal: weekly_goal,
      });
    }

    res.status(200).json({
      success: true,
      data: preference
    });
  } catch (error) {
    console.error('Error creating/updating preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


// @desc    Delete preferences
// @route   DELETE /api/preferences/:id
// @access  Private (Student only)
exports.deletePreference = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.id } });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const preference = await Preference.findByPk(req.params.id);

    if (!preference) {
      return res.status(404).json({ success: false, message: 'Preference not found' });
    }

    // Check if the preference belongs to the student
    if (preference.student_id !== student.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this preference' });
    }

    await preference.destroy();

    res.status(200).json({
      success: true,
      message: 'Preference deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting preference:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all preferences (admin only)
// @route   GET /api/preferences/all
// @access  Private (Admin only)
exports.getAllPreferences = async (req, res) => {
  try {
    const preferences = await Preference.findAll({
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'user_id']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: preferences.length,
      data: preferences
    });
  } catch (error) {
    console.error('Error fetching all preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
