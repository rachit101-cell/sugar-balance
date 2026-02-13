const router   = require('express').Router();
const { body } = require('express-validator');
const Marathon = require('../models/Marathon.model');
const User     = require('../models/User.model');
const Points   = require('../models/Points.model');
const marathonPlans = require('../../data/marathon-plans.json');
const { protect }   = require('../middleware/auth.middleware');
const validate      = require('../middleware/validate.middleware');

router.use(protect);

// GET /api/marathon — get or create current marathon
router.get('/', async (req, res, next) => {
  try {
    let marathon = await Marathon.findOne({ user: req.user._id, completed: false });
    if (!marathon) {
      marathon = await Marathon.create({
        user: req.user._id,
        days: marathonPlans.map((plan, i) => ({
          dayNumber: i + 1,
          title: plan.title,
          tasks: plan.tasks.map(t => ({ text: t, done: false })),
        })),
      });
    }
    res.json({ success: true, marathon });
  } catch (err) { next(err); }
});

// PATCH /api/marathon/task — complete a task
router.patch(
  '/task',
  [
    body('dayIndex').isInt({ min: 0 }).withMessage('Day index required'),
    body('taskIndex').isInt({ min: 0 }).withMessage('Task index required'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { dayIndex, taskIndex } = req.body;
      const marathon = await Marathon.findOne({ user: req.user._id, completed: false });
      if (!marathon) return res.status(404).json({ success: false, message: 'No active marathon' });

      const task = marathon.days[dayIndex]?.tasks[taskIndex];
      if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
      if (task.done) return res.status(400).json({ success: false, message: 'Task already done' });

      task.done = true;
      task.completedAt = new Date();

      // Check if day is fully done
      const day = marathon.days[dayIndex];
      if (day.tasks.every(t => t.done)) { day.completed = true; day.completedAt = new Date(); }

      await marathon.save();
      await User.findByIdAndUpdate(req.user._id, { $inc: { points: 15 } });
      await Points.create({ user: req.user._id, amount: 15, event: 'marathon_task', description: task.text });

      res.json({ success: true, pointsAwarded: 15, marathon });
    } catch (err) { next(err); }
  }
);

// POST /api/marathon/complete — claim 200-pt reward
router.post('/complete', async (req, res, next) => {
  try {
    const marathon = await Marathon.findOne({ user: req.user._id, completed: false });
    if (!marathon) return res.status(404).json({ success: false, message: 'No active marathon' });
    if (marathon.rewardClaimed) return res.status(400).json({ success: false, message: 'Reward already claimed' });

    marathon.completed     = true;
    marathon.completedAt   = new Date();
    marathon.rewardClaimed = true;
    await marathon.save();

    await User.findByIdAndUpdate(req.user._id, { $inc: { points: 200 } });
    await Points.create({
      user: req.user._id, amount: 200,
      event: 'marathon_complete', description: '7-Day Marathon Completion Reward',
    });

    res.json({ success: true, pointsAwarded: 200, message: '🏆 Marathon complete! +200 pts!' });
  } catch (err) { next(err); }
});

module.exports = router;
