const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  text:      { type: String, required: true },
  done:      { type: Boolean, default: false },
  completedAt: { type: Date },
}, { _id: false });

const DaySchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true },
  title:     { type: String, required: true },
  tasks:     [TaskSchema],
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
}, { _id: false });

const MarathonSchema = new mongoose.Schema(
  {
    user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, default: Date.now },
    days:      [DaySchema],
    completed: { type: Boolean, default: false },
    completedAt:   { type: Date },
    rewardClaimed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Virtual: total tasks done
MarathonSchema.virtual('tasksCompleted').get(function () {
  return this.days.reduce((sum, d) => sum + d.tasks.filter(t => t.done).length, 0);
});

// Virtual: total tasks
MarathonSchema.virtual('totalTasks').get(function () {
  return this.days.reduce((sum, d) => sum + d.tasks.length, 0);
});

module.exports = mongoose.model('Marathon', MarathonSchema);
