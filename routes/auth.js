// routes/routes.js
const express = require("express");
const { signUp, login } = require("../controllers/authController");
const {authMiddleware} = require('../middlewares/authMiddleware');
const {
  sendVerficationEmailController, verifyOtpController,
} = require("../controllers/mailController");
const authRoutes = express.Router();

// User registration
authRoutes.post("/signup", signUp);

// User login
authRoutes.post("/login", login);

// mail routes
authRoutes.post("/send-verification-code", authMiddleware, sendVerficationEmailController);
authRoutes.post("/verify-code", authMiddleware, verifyOtpController);

module.exports = authRoutes;
