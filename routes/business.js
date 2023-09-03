// routes/newAndUpdates.js
const express = require('express');
const {authMiddleware} = require('../middlewares/authMiddleware');
const businessController = require('../controllers/businessController');
const { route } = require('./auth');
const router = express.Router();


/* Define a route to register business */
router.post('/register', authMiddleware, businessController.registerBusiness);
// router.post('/image_upload_business', BusinessImageUpload);
router.get('/businessProfile', businessController.getBusinessProfiles)
router.get('/:_id', businessController.getBusinessByID);
router.put('/updateBusiness/:_id', businessController.updateBusiness)
router.delete('/deleteBusiness/:_id', businessController.deleteBusiness)

module.exports = router;
