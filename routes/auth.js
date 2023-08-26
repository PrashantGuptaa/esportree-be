// routes/routes.js
const express = require('express');
const {signUp, login } = require('../controllers/authController');

const authRoutes = express.Router();

// User registration
authRoutes.post('/signup', signUp);

// User login
authRoutes.post('/login', login);

module.exports = authRoutes;
