// routes/routes.js
const express = require("express");
const {
  signUp,
  login,
  sendOtpToUser,
  verifyOtpFromUser,
} = require("../controllers/authController");

const authRoutes = express.Router();

// User registration
authRoutes.post("/signup", signUp);

// User login
authRoutes.post("/login", login);

// mail routes
authRoutes.post("/send-verification-code", verifyOtpFromUser);
authRoutes.post("/verify-code", sendOtpToUser);

module.exports = authRoutes;
