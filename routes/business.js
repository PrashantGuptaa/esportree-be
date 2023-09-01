// routes/newAndUpdates.js
const express = require('express');
const { registerBusiness, BusinessImageUpload, GetBusinessProfiles } = require('../controllers/businessController');
const router = express.Router();
const multer = require('multer');

// Define a route to register business
router.post('/register', registerBusiness);
// router.post('/image_upload_business', BusinessImageUpload);
router.get('/get_business_profile', GetBusinessProfiles)
module.exports = router;
