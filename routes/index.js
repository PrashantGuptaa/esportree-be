// routes/index.js
const express = require('express');
const newAndUpdatesRoutes = require('./newAndUpdates');
// Import other route modules as needed

const router = express.Router();

// Configure routes
router.use('/news', newAndUpdatesRoutes);
// Use other routes here

module.exports = router;
