const User    = require('../models/User.model');
const Points  = require('../models/Points.model');
const FoodLog = require('../models/FoodLog.model');
const Marathon = require('../models/Marathon.model');

// ─── GET /api/report ──────────────────────────
const getReportCard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user   = await User.findById(userId).select('points streak longestStreak profile');
    const month  = new Date(Date.now() - 30 * 86400000);

    // Total tasks from Points events
    const tasksDone = await Points.countDocuments({
      user: userId,
      event: { $in: ['corrective_action', 'daily_task', 'marathon_task'] },
    });

    // Sugar breakdown last 30 days
    const sugarBreakdown = await FoodLog.aggregate([
      { $match: { user: userId, loggedAt: { $gte: month } } },
      { $group: { _id: '$sugarLevel', count: { $sum: 1 } } },
    ]);

    // Points per day last 30 days
    const dailyPoints = await Points.aggregate([
      { $match: { user: userId, earnedAt: { $gte: month } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$earnedAt' } }, total: { $sum: '$amount' } } },
      { $sort: { _id: 1 } },
    ]);

    // Marathon completion
    const marathon = await Marathon.findOne({ user: userId }).sort({ createdAt: -1 });

    // Activity score: points last 7 days / 200 * 100
    const week = new Date(Date.now() - 7 * 86400000);
    const weekPts = await Points.aggregate([
      { $match: { user: userId, earnedAt: { $gte: week } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const activityScore = Math.min(100, Math.round(((weekPts[0]?.total || 0) / 200) * 100));

    // Sleep score: compare logged vs recommended 8h
    const sleepScore = user.profile?.sleepHours
      ? Math.min(100, Math.round((user.profile.sleepHours / 8) * 100))
      : 0;

    // Streak consistency (current / 30 days * 100)
    const streakScore = Math.min(100, Math.round((user.streak / 30) * 100));

    res.json({
      success: true,
      report: {
        totalPoints:    user.points,
        streak:         user.streak,
        longestStreak:  user.longestStreak,
        tasksDone,
        activityScore,
        sleepScore,
        streakScore,
        sugarBreakdown,
        dailyPoints,
        marathonCompleted: marathon?.completed || false,
      },
    });
  } catch (err) { next(err); }
};

module.exports = { getReportCard };
