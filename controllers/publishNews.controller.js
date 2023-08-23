const News = require('../models/news.model');
const sendResponse = require('../utils/response');

// Handle the publish route
const publishNews = async (req, res) => {
  const { title, tags, description, image } = req.body;

  // Assuming image is passed as a base64 encoded string
  const imageBuffer = Buffer.from(image, 'base64');

  try {
    const newNews = new News({
      title,
      tags,
      description,
      image: imageBuffer,
    });

    await newNews.save();

    sendResponse(res, 201, 'News published successfully');
  } catch (error) {
    console.error('Error publishing news:', error);
    sendResponse(res, 400, 'Failed to publish news', null, [error.message]);
  }
};

module.exports = {
  publishNews,
};
