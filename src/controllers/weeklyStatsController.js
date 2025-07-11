// const { sequelize } = require('../models'); // Sequelize instance
// const { getStudentByUserId } = require('../services/studentService'); // Adjust path as needed
// const Student = require('../models/Student');

// async function getStudentByUserId(userId) {
//   return await Student.findOne({ where: { user_id: userId } });
// }


// exports.getWeeklyGoalStats = async (req, res) => {
//   try {
//     req.user = { id: 38 };
//     const userId = req.user.id;
//     const student = await getStudentByUserId(userId);

//     if (!student) {
//       return res.status(404).json({
//         success: false,
//         message: 'Student profile not found',
//         error: null
//       });
//     }

//     const { start, end } = req.query;
//     if (!start || !end) {
//       return res.status(400).json({
//         success: false,
//         message: 'Start and end dates are required',
//         error: null
//       });
//     }

//     const [results] = await sequelize.query(
//       `
//       SELECT
//         ij.jobseeker_id,
//         WEEK(ij.created_at, 1) AS week_number,
//         YEAR(ij.created_at) AS year,
//         p.weekly_goal,
//         COUNT(*) AS actual_imported_jobs
//       FROM imported_jobs ij
//       JOIN preferences p ON ij.jobseeker_id = p.student_id
//       WHERE ij.created_at BETWEEN :start AND :end
//         AND ij.jobseeker_id = :jobseekerId
//       GROUP BY ij.jobseeker_id, YEAR(ij.created_at), WEEK(ij.created_at, 1), p.weekly_goal
//       ORDER BY year, week_number
//       `,
//       {
//         replacements: {
//           start,
//           end,
//           jobseekerId: student.id
//         },
//         type: sequelize.QueryTypes.SELECT
//       }
//     );

//     res.json({
//       success: true,
//       data: results,
//       error: null
//     });

//   } catch (error) {
//     console.error('Get weekly goal stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get weekly goal stats',
//       error: process.env.NODE_ENV === 'production' ? null : error.message
//     });
//   }
// };

// const {  sequelize,  Student} = require('../config/dbInit');



//working---

// const sequelize = require('../config/dbConfig'); 
// const Student = require('../models/Student');   
// const ImportedJob = require('../models/ImportedJob');
// const Preference = require('../models/Preference')

// async function getStudentByUserId(userId) {
//   return await Student.findOne({ where: { user_id: userId } });
// }

// exports.getWeeklyGoalStats = async (req, res) => {
//   try {
//     // 🔧 Testing ke liye user hardcoded
//     req.user = { id: 38 };

//     const student = await getStudentByUserId(req.user.id);

//     if (!student) {
//       return res.status(404).json({
//         success: false,
//         message: 'Student profile not found',
//         error: null
//       });
//     }

//     const { start, end } = req.query;
//     if (!start || !end) {
//       return res.status(400).json({
//         success: false,
//         message: 'Start and end dates are required',
//         error: null
//       });
//     }

//     const [results] = await sequelize.query(
//       `
//       SELECT
//         ij.jobseeker_id,
//         WEEK(ij.created_at, 1) AS week_number,
//         YEAR(ij.created_at) AS year,
//         p.weekly_goal,
//         COUNT(*) AS actual_imported_jobs
//       FROM imported_jobs ij
//       JOIN preferences p ON ij.jobseeker_id = p.student_id
//       WHERE ij.created_at BETWEEN :start AND :end
//         AND ij.jobseeker_id = :jobseekerId
//       GROUP BY ij.jobseeker_id, YEAR(ij.created_at), WEEK(ij.created_at, 1), p.weekly_goal
//       ORDER BY year, week_number
//       `,
//       {
//         replacements: {
//           start,
//           end,
//           jobseekerId: student.id
//         },
//         type: sequelize.QueryTypes.SELECT
//       }
//     );

//     res.json({
//       success: true,
//       data: results,
//       error: null
//     });

//   } catch (error) {
//     console.error('Get weekly goal stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get weekly goal stats',
//       error: process.env.NODE_ENV === 'production' ? null : error.message
//     });
//   }
// };


//testing---


const sequelize = require('../config/dbConfig');
const Student = require('../models/Student');
const Preference = require('../models/Preference');

async function getStudentByUserId(userId) {
  return await Student.findOne({ where: { user_id: userId } });
}

exports.getWeeklyGoalStats = async (req, res) => {
  try {
    //  Hardcoded for testing (remove in production)
    req.user = { id: 38 };

    const student = await getStudentByUserId(req.user.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
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

    //  Get counts from job_status_tracks
    const [jobStats] = await sequelize.query(
      `
      SELECT
        SUM(CASE WHEN status = 'Applied' THEN 1 ELSE 0 END) AS applicationCount,
        SUM(CASE WHEN status = 'Interviewing' THEN 1 ELSE 0 END) AS interviewCount
      FROM job_status_tracks
      WHERE jobseeker_id = :jobseekerId
        AND timestamp BETWEEN :start AND :end
      `,
      {
        replacements: { jobseekerId, start, end },
        type: sequelize.QueryTypes.SELECT
      }
    );

    //  Count saved jobs from imported_jobs table
    const [savedJobResult] = await sequelize.query(
      `
      SELECT COUNT(*) AS savedJob
      FROM imported_jobs
      WHERE jobseeker_id = :jobseekerId
        AND imported_job_status = 'Saved'
        AND created_at BETWEEN :start AND :end
      `,
      {
        replacements: { jobseekerId, start, end },
        type: sequelize.QueryTypes.SELECT
      }
    );

    //  Fetch weekly goal and streak
    const preference = await Preference.findOne({ where: { student_id: jobseekerId } });

    //  Send final dashboard response
    res.json({
      success: true,
      data: {
        applicationCount: jobStats?.applicationCount || 0,
        interviewCount: jobStats?.interviewCount || 0,
        savedJob: savedJobResult?.savedJob || 0,
        weeklyGoal: preference?.weekly_goal || 0,
        streakCount: preference?.streak || 0
      },
      error: null
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard stats',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};
