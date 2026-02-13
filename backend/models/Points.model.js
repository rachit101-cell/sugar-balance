const mongoose = require('mongoose');

const PointsSchema = new mongoose.Schema(
  {
    user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },           // positive = earned, negative = deducted
    event:  {
      type: String,
      enum: [
        'corrective_action',
        'daily_task',
        'marathon_task',
        'marathon_complete',
        'group_join',
        'streak_bonus',
        'onboarding',
      ],
      required: true,
    },
    description: { type: String },
    reference:   { type: mongoose.Schema.Types.ObjectId },  // FK to FoodLog / Marathon etc.
    earnedAt:    { type: Date, default: Date.now },
  },
  { timestamps: true }
);

PointsSchema.index({ user: 1, earnedAt: -1 });

module.exports = mongoose.model('Points', PointsSchema);
