// routes/newAndUpdates.js
const express = require('express');
const router = express.Router();

const { publishNews } = require('../controllers/publishNews.controller');

// Define a route to publish news
router.post('/publish', publishNews);

module.exports = router;
