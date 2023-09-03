const mongoose = require('mongoose');

var businessSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  // business_image_url: { type: String ,default: null},
  businessName: { type: String, require: true },
  otherName: { type: String },
  businessWebsite: { type: String },
  businessSize: { type: String, required: true },
  businessHQLocation: { type: String, required: true },
  language: { type: String },
  yearFounded: { type: Number },
  businessType: { type: String, required: true },
  deleted: { type: Boolean, default: false },
},
{ timestamps: true }
);


var businessSchema = mongoose.model('Business', businessSchema);

module.exports = { 
    businessSchema: businessSchema 
};
