const FoodLog  = require('../models/FoodLog.model');
const foodData = require('../../data/food-products.json');

// ─── GET /api/food/products ───────────────────
const getAllProducts = (req, res) => {
  const { category } = req.query;
  const list = category
    ? foodData.filter(f => f.category === category)
    : foodData;
  res.json({ success: true, products: list });
};

// ─── POST /api/food/log ───────────────────────
const logFood = async (req, res, next) => {
  try {
    const { item, brix, sugarLevel, category, emoji } = req.body;
    const log = await FoodLog.create({
      user: req.user._id,
      item, brix, sugarLevel, category, emoji,
    });
    res.status(201).json({ success: true, log, message: 'Food logged! Complete a corrective action to earn points.' });
  } catch (err) { next(err); }
};

// ─── POST /api/food/log/:id/corrective ────────
const completeCorrectiveAction = async (req, res, next) => {
  try {
    const { type } = req.body;  // 'Walk' | 'Exercise' | 'Hydration'
    const log = await FoodLog.findOne({ _id: req.params.id, user: req.user._id });
    if (!log) return res.status(404).json({ success: false, message: 'Log entry not found' });
    if (log.correctiveAction.completedAt) {
      return res.status(400).json({ success: false, message: 'Corrective action already completed' });
    }

    // Points based on sugar level
    const pointsMap = { Low: 10, Medium: 20, High: 30 };
    const points = pointsMap[log.sugarLevel] || 20;

    log.correctiveAction = { type, completedAt: new Date(), pointsAwarded: points };
    await log.save();

    // Update user points
    const User   = require('../models/User.model');
    const Points = require('../models/Points.model');
    await User.findByIdAndUpdate(req.user._id, { $inc: { points } });
    await Points.create({
      user: req.user._id, amount: points,
      event: 'corrective_action',
      description: `${type} after logging ${log.item}`,
      reference: log._id,
    });

    res.json({ success: true, pointsAwarded: points, message: `+${points} pts for completing ${type}!` });
  } catch (err) { next(err); }
};

// ─── GET /api/food/history ────────────────────
const getHistory = async (req, res, next) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    const logs = await FoodLog.find({ user: req.user._id })
      .sort({ loggedAt: -1 }).limit(+limit).skip(skip);
    const total = await FoodLog.countDocuments({ user: req.user._id });
    res.json({ success: true, logs, total, page: +page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

module.exports = { getAllProducts, logFood, completeCorrectiveAction, getHistory };
