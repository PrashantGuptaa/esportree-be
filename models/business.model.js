const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  businessName: { type: String, require: true },
  businessWebsite: { type: String, required: true },
  email: { type: String, required: true  },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  tokenExpiration: { type: Date }, 
},
{ timestamps: true }
);


const businessCataloguesSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true }, // Reference to the User model
  businesLogoUrl: { type: String ,default: null},
  businessName: { type: String, index: true },
  otherName: { type: String },
  description : { type: String, required: true },
  businessWebsite: { type: String },
  email: { type: String },
  mobile: { type: String, required: true },
  companyType : { type: String, required: true },
  businessSize: { type: String, required: true},
  businessHQLocation: { type: String, required: true },
  language: { type: String },
  yearFounded: { type: Number, required: true },
  otherAccounts : [{type: String}],
  deleted: { type: Boolean, default: false },
},
{ timestamps: true }
);

// businessCataloguesSchema.index({ businessId: 1 }, { unique: true });

const BusinessCatalogue = mongoose.model('Catalogue', businessCataloguesSchema);
const business = mongoose.model('Business', businessSchema);

module.exports = {business : business, BusinessCatalogue: BusinessCatalogue};