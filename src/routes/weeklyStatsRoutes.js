const express = require('express');
const router = express.Router();
const { getWeeklyGoalStats } = require('../controllers/weeklyStatsController');
const { protect, checkRole  } = require('../middleware/authMiddleware');

router.get('/statsGoal',protect,checkRole(['student']),getWeeklyGoalStats);

module.exports = router;