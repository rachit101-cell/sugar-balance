const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true, unique: true },
    description: { type: String },
    emoji:       { type: String, default: '👥' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // Daily leaderboard snapshot (refreshed each day via cron)
    dailyRanking: [
      {
        user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        points: { type: Number, default: 0 },
        rank:   { type: Number },
      },
    ],
    rankingDate: { type: Date },
  },
  { timestamps: true }
);

// Virtual: member count
GroupSchema.virtual('memberCount').get(function () {
  return this.members.length;
});

module.exports = mongoose.model('Group', GroupSchema);
