const express = require('express');
const router = express.Router();
const { getWeeklyGoalStats } = require('../controllers/weeklyStatsController');
// const authenticate = require('../middleware/authenticate'); // Your auth middleware

// router.get('/weekly-goal-vs-actual', authenticate, getWeeklyGoalStats);
router.get('/goal',getWeeklyGoalStats);

module.exports = router;