const jwt     = require('jsonwebtoken');
const jwtConf = require('../../config/jwt.config');
const User    = require('../models/User.model');
const Points  = require('../models/Points.model');

// ─── Helper: sign token ───────────────────────
const signToken = (id) =>
  jwt.sign({ id }, jwtConf.secret, { expiresIn: jwtConf.expiresIn });

// ─── POST /api/auth/register ──────────────────
const register = async (req, res, next) => {
  try {
    const { name, email, password, profile } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password, profile });

    // Award 50 onboarding points
    await Points.create({
      user:        user._id,
      amount:      50,
      event:       'onboarding',
      description: 'Welcome bonus for completing onboarding',
    });
    user.points = 50;
    await user.save();

    const token = signToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, points: user.points, streak: user.streak },
    });
  } catch (err) { next(err); }
};

// ─── POST /api/auth/login ─────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    user.updateStreak();
    await user.save();

    const token = signToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, points: user.points, streak: user.streak },
    });
  } catch (err) { next(err); }
};

// ─── GET /api/auth/me ─────────────────────────
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { register, login, getMe };
