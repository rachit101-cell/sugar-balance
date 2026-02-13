const mongoose = require('mongoose');

const FoodLogSchema = new mongoose.Schema(
  {
    user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    item:  { type: String, required: true, trim: true },
    emoji: { type: String, default: '🍎' },

    // Sugar data
    brix:       { type: Number, required: true },        // degrees Brix
    sugarLevel: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    category:   { type: String, enum: ['Tea/Coffee', 'Biscuits', 'Cold Drinks', 'Sweets', 'Fruits'] },

    // Corrective action
    correctiveAction: {
      type:        { type: String, enum: ['Walk', 'Exercise', 'Hydration'], default: null },
      completedAt: { type: Date, default: null },
      pointsAwarded: { type: Number, default: 0 },
    },

    loggedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index for fast user queries sorted by date
FoodLogSchema.index({ user: 1, loggedAt: -1 });

module.exports = mongoose.model('FoodLog', FoodLogSchema);
