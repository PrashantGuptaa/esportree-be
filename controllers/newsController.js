// controllers/newsController.js
const News = require("../models/news.model");
const sendResponse = require("../utils/response");


/* Handle the publish route */
exports.publishNews = async (req, res) => {
  try {
    const { category, ...newsData } = req.body;

    const allowedCategories = ['Announcement', 'International', 'Local', 'Discussion', 'Pubg'];
    if (!allowedCategories.includes(category)) {
      return sendResponse(res, 400, "Invalid category provided", null, ["Invalid category"]);
    }

    let newsPublish = await News.create({ userId: req.userId, category, ...newsData });
    return sendResponse(res, 201, "Created successfully", newsPublish);        
    
  } catch (error) {
    console.error("Error publishing news:", error);
    sendResponse(res, 400, "Failed to publish news", null, [error.message]);
  }
};

/* Handle fetching news and updates */
exports.getNewsAndUpdates = async (req, res) => {
  try {
    let { offset, limit } = req.query;
    offset = parseInt(offset);
    limit = parseInt(limit);
    offset = offset >= 0 ? offset : 0;
    limit = limit >= 10 ? limit : 10;

    const news = await News
    .aggregate([
        { $match: {deleted: false} },
        {
          $project: {
              userId: 0,
              _id: 0,
              comments: 0,
          },
      },
      {
          $project: {
              title: 1,
              tags: 1,
              description: 1,
              image_url: 1,
              category: 1,
              deleted : 1,
              updatedAt: 1
          },
      },
        {
            $sort: {
                updatedAt : -1
            }
        },
        {$facet : {
            news : [{$skip : offset}, {$limit : limit}],
            totalCount : [{$count : 'count'}]
        }}
    ]).exec(); 
    
    return sendResponse(res, 200, "Fetched news and updates", news);
  } catch (error) {
    console.error("Error fetching news and updates:", error);
    sendResponse(res, 500, "Failed to fetch news and updates", null, [
      error.message,
    ]);
  }
};

/* News by id*/
exports.getNewsById = async (req, res) => {
  try {
    let _id = req.params;

    const news = await News.findOne({ _id, deleted: false });
    if (!news) {
      return sendResponse(res, 404, "News not found");
  } else {
      return sendResponse(res, 200, "News fetched successfully", news);
  }
  
  } catch (error) {
    console.error('Error fetching news by ID:', error);
    res.status(500).json({ message: 'Failed to fetch news by ID' });
  }
};

/* Add comments */
exports.createComment = async (req, res) => {
  try {
    const { text } = req.body;
    const newsId = req.params.newsId;
    const userId = req.userId; 

    const newsPost = await News.findById(newsId);
    if (!newsPost) {
      return sendResponse(res, 404, "News post not found");
    }

    const comment = {
      userId,
      text,
    };

    newsPost.comments.push(comment);
    await newsPost.save();

    return sendResponse(res, 201, "Added successfully", comment);        
  } catch (error) {
    console.error("Error adding Comments:", error);
    sendResponse(res, 400, "Failed to Comments", null, [error.message]);
  }
};

/*Get comments */
exports.getComments = async (req, res) => {
  try {
    const newsId = req.params.newsId;

    const newsPost = await News.findById(newsId);
    if (!newsPost) {
      return sendResponse(res, 404, 'News post not found');
    }

    // Extract comments from the news post
    const comments = newsPost.comments;
    return sendResponse(res, 200, "Fetched comments", comments);

  } catch (error) {
    console.error("Error fetching comments:", error);
    sendResponse(res, 500, "Failed to fetch comments", null, [
      error.message,
    ]);
  }
};

/* edit comments */
exports.updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    const newsId = req.body.newsId;
    const commentId = req.body.commentId;

    const newsPost = await News.findById(newsId);
    if (!newsPost) {
      return sendResponse(res, 404, "News post not found");
    }

    const comment = newsPost.comments.id(commentId);
    if (!comment) {
      return sendResponse(res, 404, "News post not found");
    }

    // Check if the user trying to update the comment is the comment's author
    if (comment.userId.toString() !== req.userId) {
      return sendResponse(res, 403, "You are not authorized to update this comment");
    }

    comment.text = text;
    await newsPost.save();
    return sendResponse(res, 200, "Fetched comments and updated", comment);

  } catch (error) {
    console.error("Error updating comments:", error);
    sendResponse(res, 500, "Failed to updating comments", null, [
      error.message,
    ]);
  }
};

/* delete comment */
exports.deleteComment = async (req, res) => {
  try {
    const newsId = req.params.newsId;
    const commentId = req.params.commentId;

    const newsPost = await News.findById(newsId);
    if (!newsPost) {
      return sendResponse(res, 404, "News post not found");
    }

    const comment = newsPost.comments.find((c) => c._id.toString() === commentId);
    if (!comment) {
      return sendResponse(res, 404, "Comment not found");
    }

    // Check if the user trying to delete the comment is the comment's author
    if (comment.userId.toString() === req.userId) {
      newsPost.comments.splice(newsPost.comments.indexOf(comment), 1);
      await newsPost.save();

      return sendResponse(res, 200, "Comment Deleted Succesfully");
    } else {
      return sendResponse(res, 403, "You are not authorized to delete this comment");
    }
  } catch (error) {
    console.error("Error deleting comments:", error);
    sendResponse(res, 500, "Failed to delete comments", null, [
      error.message,
    ]);
  }
};

/* like news */
exports.likeNews = async (req, res) => {
  const newsId = req.params.newsId;
  const userId = req.userId; 
  try {
    const news = await News.findById(newsId);
    if (!news) {
      return sendResponse(res, 404, "News post not found");
    }
    const isLiked = news.likes.some(like => like.userId.equals(userId));
    const isDisliked = news.dislikes.some(dislike => dislike.userId.equals(userId));

    if (isDisliked) {
      news.dislikes = news.dislikes.filter(dislike => !dislike.userId.equals(userId));
    }

    if (!isLiked) {
      news.likes.push({ userId });
    }

    await news.save();
    return sendResponse(res, 200, 'Post liked successfully' );
  } catch (error) {
    console.error("Error adding like:", error);
    sendResponse(res, 400, "Failed to like", null, [error.message]);
  }
};

/* Dislike */
exports.dislikeNews = async (req, res) => {
  const newsId = req.params.newsId;
  const userId = req.userId; 
  try {
    const news = await News.findById(newsId);
    if (!news) {
      return sendResponse(res, 404, "News post not found");
    }
    // Check if the user has already liked the post
    const isLiked = news.likes.some(like => like.userId.equals(userId));
    const isDisliked = news.dislikes.some(dislike => dislike.userId.equals(userId));

    if (isLiked) {
      news.likes = news.likes.filter(like => !like.userId.equals(userId));
    }  
    if (!isDisliked) {
      news.dislikes.push({ userId });
    }
    await news.save();
    return sendResponse(res, 200, 'Post disliked successfully' );

  } catch (error) {
    console.error("Error adding dislike:", error);
    sendResponse(res, 400, "Failed to dislike", null, [error.message]);
  }
};
