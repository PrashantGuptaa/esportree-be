// routes/index.js
const express = require('express');
const authRoutes = require('./auth');
const newAndUpdatesRoutes = require('./newAndUpdates');
// Import other route modules as needed

const router = express.Router();

// Configure routes
router.use('/news', newAndUpdatesRoutes);
router.use('/auth', authRoutes);

// Use other routes here

module.exports = router;
