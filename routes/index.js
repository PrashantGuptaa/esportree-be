// routes/index.js
const express = require('express');
const authRoutes = require('./auth');
const eventsRouter = require('./events');
const newAndUpdatesRoutes = require('./newAndUpdates');
const business = require('./business');
const tournament =require('./tournament')
// Import other route modules as needed

const router = express.Router();

// Configure routes
router.use('/news', newAndUpdatesRoutes);
router.use('/auth', authRoutes);
router.use('/event', eventsRouter);
router.use('/business', business);
router.use('/tournament', tournament);

// Use other routes here

module.exports = router;
