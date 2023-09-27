// routes/newAndUpdates.js
const express = require('express');
const {authMiddleware} = require('../middlewares/authMiddleware');
const businessController = require('../controllers/businessController');
const { route } = require('./auth');
const router = express.Router();


/* Define a route to register business */
router.post('/register', authMiddleware, businessController.registerBusiness);
router.get('/verify/:token', businessController.verifyBusiness);
router.post('/regenerateToken', businessController.regenerateVerificationToken);

router.post('/createCatalogue', businessController.createCatalogue);
// router.post('/image_upload_business', BusinessImageUpload);
router.get('/catalogue', businessController.getBusinessCatalogue)
router.get('/:_id', businessController.getCatalogueByID);
router.put('/updateCatalogue/:_id', businessController.updateCatalogue)
router.delete('/deleteCatalogue/:_id', businessController.deleteCatalogue)
router.get('/search/business', businessController.searchBusinesses);

module.exports = router;
