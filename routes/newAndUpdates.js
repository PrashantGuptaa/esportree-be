// routes/newAndUpdates.js
const express = require('express');
const newscontroller = require('../controllers/newsController');
const router = express.Router();
const {authMiddleware} = require('../middlewares/authMiddleware');
const uploadToS3 = require('../middlewares/uploadMiddleware');

// Define a route to publish news
router.post('/publish', authMiddleware,  uploadToS3('news'),newscontroller.publishNews);
router.get('/newsUpdates', newscontroller.getNewsAndUpdates);
router.get('/:_id', newscontroller.getNewsById);

/* Comments */ 
router.post('/comments/:newsId', authMiddleware, newscontroller.createComment);
router.get('/getComments/:newsId', newscontroller.getComments);
router.post('/comments',authMiddleware, newscontroller.updateComment)
router.delete('/comments/:newsId/:commentId', authMiddleware, newscontroller.deleteComment);

/* Like / dislike */
router.post('/like/:newsId', authMiddleware, newscontroller.likeNews )
router.post('/dislike/:newsId', authMiddleware, newscontroller.dislikeNews )


module.exports = router;
