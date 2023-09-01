// routes/index.js
const express = require('express');
const authRoutes = require('./auth');
const eventsRouter = require('./events');
const newAndUpdatesRoutes = require('./newAndUpdates');
const businessRoutes = require('./business')
// Import other route modules as needed

const router = express.Router();

// Configure routes
router.use('/news', newAndUpdatesRoutes);
router.use('/auth', authRoutes);
<<<<<<< HEAD
router.use('/Business', businessRoutes);
=======
router.use('/event', eventsRouter);
>>>>>>> 65b82ae9114c1cd1631f3667b1786ff987450397

// Use other routes here

module.exports = router;
