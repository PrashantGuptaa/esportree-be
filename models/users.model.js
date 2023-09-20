// models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
      },
    ],
    active: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Enable timestamps (createdAt and updatedAt fields)
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
