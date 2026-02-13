const User    = require('../models/User.model');
const Points  = require('../models/Points.model');
const FoodLog = require('../models/FoodLog.model');

// ─── GET /api/users/profile ───────────────────
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('groups', 'name emoji');
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

// ─── PUT /api/users/profile ───────────────────
const updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'profile', 'theme'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true, runValidators: true,
    });
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

// ─── GET /api/users/stats ─────────────────────
const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const today  = new Date(); today.setHours(0,0,0,0);
    const week   = new Date(today - 6 * 86400000);

    // Points earned this week (7 days)
    const weeklyPoints = await Points.aggregate([
      { $match: { user: userId, earnedAt: { $gte: week } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$earnedAt' } }, total: { $sum: '$amount' } } },
      { $sort: { _id: 1 } },
    ]);

    // Food logs today
    const todayLogs = await FoodLog.find({ user: userId, loggedAt: { $gte: today } });

    // Sugar level breakdown (last 30 days)
    const month = new Date(today - 29 * 86400000);
    const sugarBreakdown = await FoodLog.aggregate([
      { $match: { user: userId, loggedAt: { $gte: month } } },
      { $group: { _id: '$sugarLevel', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      stats: {
        points:       req.user.points,
        streak:       req.user.streak,
        longestStreak: req.user.longestStreak,
        weeklyPoints,
        todayLogs,
        sugarBreakdown,
      },
    });
  } catch (err) { next(err); }
};

module.exports = { getProfile, updateProfile, getStats };
