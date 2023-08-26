// controllers/newsController.js
const News = require("../models/news.model");
const sendResponse = require("../utils/response");

// Handle fetching news and updates
const getNewsAndUpdates = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 }); // Fetch news in descending order of creation
    sendResponse(res, 200, "Fetched news and updates", news);
  } catch (error) {
    console.error("Error fetching news and updates:", error);
    sendResponse(res, 500, "Failed to fetch news and updates", null, [
      error.message,
    ]);
  }
};

// Handle the publish route
const publishNews = async (req, res) => {

  try {
    const { title, tags, description, image } = req.body;


    // Assuming image is passed as a base64 encoded string
    const imageBuffer = Buffer.from(image, "base64");
  
    if (!title || !tags || tags.length === 0 || !description || !image) {
        sendResponse(res, 400, 'Missing required fields');
        return;
      }
    const newNews = new News({
      userId: req.userId,
      title,
      tags,
      description,
      image: imageBuffer,
    });

    await newNews.save();

    sendResponse(res, 201, "News published successfully");
  } catch (error) {
    console.error("Error publishing news:", error);
    sendResponse(res, 400, "Failed to publish news", null, [error.message]);
  }
};

module.exports = {
  getNewsAndUpdates,
  publishNews,
};
