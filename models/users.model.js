// models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  twoFactorAuthCompleted: { type: Boolean },
  otp: { type: Number },
  otpValidity: { type: Number },
  active: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }, // Automatically set to the current date and time when the document is created
  lastUpdated: { type: Date, default: Date.now }, // Automatically updated whenever the document is modified
});

const User = mongoose.model("User", userSchema);

module.exports = User;
