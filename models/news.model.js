// models/news.js
const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  title: { type: String, required: true },
  tags: [{ type: String }],
  description: { type: String, required: true },
  image_url: [{type: String, default: null}],
  category: { type: String, required: true },
  deleted: { type: Boolean, default: false },
  likes: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  dislikes: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      text: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ], 
},
{ timestamps: true }
);

const News = mongoose.model('News', newsSchema);

module.exports = News;
