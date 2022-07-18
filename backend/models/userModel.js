//think models as templates for mongoDB, fills it in and sets it up
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
});

const User = mongoose.model("user", userSchema);

module.exports = User;