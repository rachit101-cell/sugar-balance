const router = require('express').Router();
const Group  = require('../models/Group.model');
const User   = require('../models/User.model');
const Points = require('../models/Points.model');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

// GET /api/community/groups — list all groups
router.get('/groups', async (req, res, next) => {
  try {
    const groups = await Group.find().select('-dailyRanking').populate('createdBy', 'name');
    res.json({ success: true, groups });
  } catch (err) { next(err); }
});

// POST /api/community/groups/:id/join
router.post('/groups/:id/join', async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    if (group.members.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Already a member' });
    }

    group.members.push(req.user._id);
    await group.save();

    await User.findByIdAndUpdate(req.user._id, { $addToSet: { groups: group._id }, $inc: { points: 50 } });
    await Points.create({ user: req.user._id, amount: 50, event: 'group_join', description: `Joined ${group.name}` });

    res.json({ success: true, message: `Joined ${group.name}! +50 pts`, group });
  } catch (err) { next(err); }
});

// GET /api/community/leaderboard — daily ranking across all users
router.get('/leaderboard', async (req, res, next) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);

    const ranking = await Points.aggregate([
      { $match: { earnedAt: { $gte: today } } },
      { $group: { _id: '$user', todayPoints: { $sum: '$amount' } } },
      { $sort:  { todayPoints: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from:         'users',
          localField:   '_id',
          foreignField: '_id',
          as:           'userInfo',
        },
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          name:        '$userInfo.name',
          totalPoints: '$userInfo.points',
          todayPoints: 1,
        },
      },
    ]);

    res.json({ success: true, ranking });
  } catch (err) { next(err); }
});

module.exports = router;
