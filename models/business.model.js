const mongoose = require('mongoose');

var businessSchema = new mongoose.Schema({
  // business_image_url: { type: String ,default: null},
  image: { type: Buffer },
  businessName: { type: String },
  otherName: { type: String },
  businessWebsite: { type: String },
  businessSize: { type: String },
  businessHQLocation: { type: String },
  language: { type: String },
  yearFounded: { type: Number },
  businessType: { type: String }
},
{ timestamps: true }
);


var businessSchema = mongoose.model('Business', businessSchema);

module.exports = { 
    businessSchema: businessSchema 
};
