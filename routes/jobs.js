// routes/routes.js
const express = require('express');
const { create, list } = require('../controllers/jobsController');
const jobsRoutes = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');


// Create a new job
jobsRoutes.post('/create', authMiddleware, create);

// List the jobs
jobsRoutes.post('/list', authMiddleware, list);

module.exports = jobsRoutes;
