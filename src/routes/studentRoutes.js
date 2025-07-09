const express = require('express');
const router = express.Router();

const studentController = require('../controllers/studentController');
const jobApplicationController = require('../controllers/jobApplicationController');
const contactController = require('../controllers/contactController');
const taskController = require('../controllers/taskController'); // <-- Import Task Controller

const { protect, checkRole, isActive } = require('../middleware/authMiddleware');

// Public routes
router.get('/', studentController.getAllStudents);

// Task routes (Student only)
router.post('/tasks', protect, checkRole(['student']), taskController.addTask);
router.get('/tasks', protect, checkRole(['student']), taskController.getTasks);
router.put('/tasks/:id', protect, checkRole(['student']), taskController.updateTask);
router.delete('/tasks/:id', protect, checkRole(['student']), taskController.deleteTask);

// Private routes - Student only
router.post('/profile', protect, checkRole(['student']), studentController.createUpdateStudentProfile);
router.get('/profile/me', protect, checkRole(['student']), studentController.getStudentProfile);

// Job application routes
router.get('/applications', protect, checkRole(['student']), jobApplicationController.getStudentApplications);

// Education routes
router.post('/education', protect, checkRole(['student']), studentController.addEducation);
router.put('/education/:id', protect, checkRole(['student']), studentController.updateEducation);
router.delete('/education/:id', protect, checkRole(['student']), studentController.deleteEducation);

// Work Experience routes
router.post('/work-experience', protect, checkRole(['student']), studentController.addWorkExperience);
router.put('/work-experience/:id', protect, checkRole(['student']), studentController.updateWorkExperience);
router.delete('/work-experience/:id', protect, checkRole(['student']), studentController.deleteWorkExperience);

// Project Experience routes
router.post('/project-experience', protect, checkRole(['student']), studentController.addProjectExperience);
router.put('/project-experience/:id', protect, checkRole(['student']), studentController.updateProjectExperience);
router.delete('/project-experience/:id', protect, checkRole(['student']), studentController.deleteProjectExperience);

// Certification routes
router.post('/certification', protect, checkRole(['student']), studentController.addCertification);
router.put('/certification/:id', protect, checkRole(['student']), studentController.updateCertification);
router.delete('/certification/:id', protect, checkRole(['student']), studentController.deleteCertification);

// Award/Achievement routes
router.post('/award-achievement', protect, checkRole(['student']), studentController.addAwardAchievement);
router.put('/award-achievement/:id', protect, checkRole(['student']), studentController.updateAwardAchievement);
router.delete('/award-achievement/:id', protect, checkRole(['student']), studentController.deleteAwardAchievement);

// Contact routes
router.get('/contacts', protect, checkRole(['student']), contactController.getContacts);
router.get('/contacts/:id', protect, checkRole(['student']), contactController.getContactById);
router.post('/contacts', protect, checkRole(['student']), contactController.addContact);
router.put('/contacts/:id', protect, checkRole(['student']), contactController.updateContact);
router.delete('/contacts/:id', protect, checkRole(['student']), contactController.deleteContact);

// Put the generic ID route LAST, after all specific routes
router.get('/:id', studentController.getStudentById);


// find weekly-goal

router.get('/weeklygoal', async (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ error: 'Start and end dates are required' });
  }

  try {
    const [rows] = await db.execute(
      `
      SELECT
        ij.jobseeker_id,
        WEEK(ij.created_at, 1) AS week_number,
        YEAR(ij.created_at) AS year,
        p.weekly_goal,
        COUNT(*) AS actual_imported_jobs
      FROM imported_jobs ij
      JOIN preference p ON ij.jobseeker_id = p.jobseeker_id
      WHERE ij.created_at BETWEEN ? AND ?
      GROUP BY ij.jobseeker_id, YEAR(ij.created_at), WEEK(ij.created_at, 1), p.weekly_goal
      ORDER BY ij.jobseeker_id, year, week_number
      `,
      [start, end]
    );

    res.json(rows);
  } catch (error) {
    console.error('Goal vs actual error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
