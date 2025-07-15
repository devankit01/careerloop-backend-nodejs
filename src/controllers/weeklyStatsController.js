const sequelize = require('../config/dbConfig');
const Student = require('../models/Student');
const Preference = require('../models/Preference');

async function getStudentByUserId(userId) {
  return await Student.findOne({ where: { user_id: userId } });
}

exports.getWeeklyGoalStats = async (req, res) => {
  try {
        const userId = req.user.id;
    const student = await getStudentByUserId(userId);

    // req.user = { id: 38 }; 
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
        error: null
      });
    }

    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({
        success: false,
        message: 'Start and end dates are required',
        error: null
      });
    }

    const jobseekerId = student.id;
    const [jobStats] = await sequelize.query(
      `
      SELECT 
        COUNT(CASE WHEN t.status = 'Saved' THEN 1 END) AS savedJob,
        COUNT(CASE WHEN t.status = 'Applied' THEN 1 END) AS applicationCount,
        COUNT(CASE WHEN t.status = 'Interviewing' THEN 1 END) AS interviewCount,
        COUNT(*) AS totalJobs
      FROM job_status_tracks t
      JOIN (
        SELECT job_id, MAX(timestamp) AS latest_time
        FROM job_status_tracks
        WHERE jobseeker_id = :jobseekerId
          AND timestamp >= :start AND timestamp < DATE_ADD(:end, INTERVAL 1 DAY)
        GROUP BY job_id
      ) latest 
      ON t.job_id = latest.job_id AND t.timestamp = latest.latest_time
      WHERE t.jobseeker_id = :jobseekerId
      `,
      {
        replacements: { jobseekerId, start, end },
        type: sequelize.QueryTypes.SELECT
      }
    );

    // Fetch preferences for goal and streak
    const preference = await Preference.findOne({ where: { student_id: jobseekerId } });

    // Send final result
    res.json({
      success: true,
      data: {
        applicationCount: jobStats?.applicationCount || 0,
        interviewCount: jobStats?.interviewCount || 0,
        savedJob: jobStats?.savedJob || 0,
        totalJobs: jobStats?.totalJobs || 0,
        weeklyGoal: preference?.weekly_goal || 0,
        streakCount: preference?.streak || 0
      },
      error: null
    });

  } catch (error) {
    console.error('Error fetching weekly stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};
