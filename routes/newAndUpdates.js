// routes/newAndUpdates.js
const express = require('express');
const { getNewsAndUpdates,publishNews } = require('../controllers/newsController');
const router = express.Router();

const {authMiddleware} = require('../middlewares/authMiddleware');

// Define a route to publish news
router.post('/publish', authMiddleware, publishNews);
router.get('/news-updates', getNewsAndUpdates);

module.exports = router;
