//sample and testing how to
const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
  reps: { type: Number, required: true },
  sets: { type: Number, required: true },
  totalWeight: { type: Number, required: true },
  timeSpent: { type: Number, required: true },
});

const Workout = mongoose.model("workout", workoutSchema);

module.exports = Workout;