const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },

    // Health profile (from onboarding)
    profile: {
      age:        { type: Number, min: 5, max: 99 },
      height:     { type: Number },   // cm
      weight:     { type: Number },   // kg
      sleepHours: { type: Number },
      dailySteps: { type: Number },
      goal:       { type: String, enum: ['reduce', 'weight', 'energy', 'family'], default: 'reduce' },
    },

    // Gamification
    points:       { type: Number, default: 0 },
    streak:       { type: Number, default: 0 },
    longestStreak:{ type: Number, default: 0 },
    lastActiveDate: { type: Date },
    level:        { type: Number, default: 1 },

    // Community
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],

    // Preferences
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  },
  { timestamps: true }
);

// ─── Hash password before save ────────────────
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Compare password ─────────────────────────
UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// ─── Update streak ────────────────────────────
UserSchema.methods.updateStreak = function () {
  const today     = new Date().toDateString();
  const lastActive = this.lastActiveDate
    ? new Date(this.lastActiveDate).toDateString()
    : null;
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (lastActive === today) return;                     // already updated today
  if (lastActive === yesterday) {
    this.streak += 1;                                   // consecutive day
  } else {
    this.streak = 1;                                    // reset
  }
  this.longestStreak = Math.max(this.streak, this.longestStreak);
  this.lastActiveDate = new Date();
};

module.exports = mongoose.model('User', UserSchema);
