const Points = require('../models/Points.model');
const User   = require('../models/User.model');

// ─── GET /api/points ──────────────────────────
const getPoints = async (req, res, next) => {
  try {
    const user   = await User.findById(req.user._id).select('points streak');
    const recent = await Points.find({ user: req.user._id })
      .sort({ earnedAt: -1 }).limit(10);
    res.json({ success: true, total: user.points, streak: user.streak, recent });
  } catch (err) { next(err); }
};

// ─── GET /api/points/history ──────────────────
const getPointsHistory = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const since = new Date(Date.now() - days * 86400000);

    const history = await Points.aggregate([
      { $match: { user: req.user._id, earnedAt: { $gte: since } } },
      {
        $group: {
          _id:   { $dateToString: { format: '%Y-%m-%d', date: '$earnedAt' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, history });
  } catch (err) { next(err); }
};

// ─── POST /api/points/award (internal use) ────
const awardPoints = async (req, res, next) => {
  try {
    const { amount, event, description } = req.body;
    const record = await Points.create({ user: req.user._id, amount, event, description });
    const user   = await User.findByIdAndUpdate(
      req.user._id, { $inc: { points: amount } }, { new: true }
    );
    res.json({ success: true, newTotal: user.points, record });
  } catch (err) { next(err); }
};

module.exports = { getPoints, getPointsHistory, awardPoints };
