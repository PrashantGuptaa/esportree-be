// routes/index.js
const express = require('express');
const authRoutes = require('./auth');
const newAndUpdatesRoutes = require('./newAndUpdates');
const jobsRoutes = require('./jobs');
// Import other route modules as needed

const router = express.Router();

// Configure routes
router.use('/news', newAndUpdatesRoutes);
router.use('/auth', authRoutes);
router.use('/jobs', jobsRoutes);

// Use other routes here

module.exports = router;
