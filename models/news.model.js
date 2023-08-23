// models/news.js
const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tags: [{ type: String }],
  description: { type: String, required: true },
  image: { type: Buffer, required: true },
  createdAt: { type: Date, default: Date.now },       // Automatically set to the current date and time when the document is created
  lastUpdated: { type: Date, default: Date.now },    // Automatically updated whenever the document is modified
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
