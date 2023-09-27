const bcrypt = require("bcrypt");
const sendResponse = require("../utils/response");
const { business, BusinessCatalogue } = require("../models/business.model"); 
const sendEmailService = require('../services/emailService');
const { generateVerificationToken } = require('../services/token');
const moment = require('moment');


/* register Business*/
exports.registerBusiness = async (req, res) => {
  const { businessName, email, businessWebsite } = req.body;
  
  if (!businessName || !email || !businessWebsite) {
    return sendResponse(res, 403, "businessName, email, or businessWebsite is missing")
  }

  const emailHostName = email.split('@')[1];
  const websiteHostName = new URL(businessWebsite).hostname;

  // Check if the email hostname and website hostname match
  if (emailHostName !== websiteHostName) {
    return sendResponse(res, 400, 'Email and website hostnames do not match.');        
   
  }

  // Check if there is an existing unverified business with the same email
  const existingUnverifiedBusiness = await business.findOne({ email, isVerified: false });
  if (existingUnverifiedBusiness) {

    const verificationLink = `https://esportee.com/verify/${existingUnverifiedBusiness.verificationToken}`;
    await sendEmailService(
      email,
      'Email Verification',
      `Click the following link to verify your business: ${verificationLink}`
    );
    return sendResponse(res, 400, 'A verification link has been sent to your email. Please verify your account.', existingUnverifiedBusiness );
  }

  // Check if there is an existing business with the same website hostname
  const existingBusiness = await business.findOne({ businessWebsite: { $regex: websiteHostName, $options: 'i' } });
  if (existingBusiness) {
    return sendResponse(res, 400, 'A business with the same hostname already exists.');        
  }

  const token = generateVerificationToken();
  const tokenExpiration = moment().add(5, 'minutes');

  const newBusiness = new business({
    userId: req.userId,
    businessName,
    email,
    businessWebsite,
    verificationToken: token,
    tokenExpiration
  });

  try {
    await newBusiness.save();

    // Send an email verification link
    const verificationLink = `https://esportee.com/verify/${newBusiness.verificationToken}`;
    await sendEmailService(email, 'Email Verification', `Click the following link to verify your business: ${verificationLink}`);
    
    return sendResponse(res, 201, 'Business registered successfully. Please check your email for verification.', newBusiness );        
  } catch (error) {
    console.error("Error registering business:", error);
    sendResponse(res, 400, "Failed to register", null, [error.message]);
  } 
};

/* verify business */
exports.verifyBusiness = async (req, res) => {
    const { token } = req.params;
    try {
      const businessRecord = await business.findOne({ verificationToken: token });
      if (!businessRecord) {
        return sendResponse(res, 404, 'Business not found or already verified.');
      }
  
      const tokenExpiration = businessRecord.tokenExpiration;
      if (!tokenExpiration || moment().isAfter(tokenExpiration)) {
      sendResponse(res, 400, 'Verification link has expired. Please request a new one.');

      businessRecord.isVerified = false;
      await businessRecord.save();
      return;
      }
  
      // Update business record to mark it as verified
      businessRecord.isVerified = true;
      await businessRecord.save();
  
      return sendResponse(res, 200, 'Business verified successfully.');
  } catch (error) {
    console.error("Error verifying business:", error);
    sendResponse(res, 500, "Failed to verify business", null, [error.message]);
  }
};

/*regenerate verification link */
exports.regenerateVerificationToken = async (req, res) => {
  const { email } = req.body;
  try {
    const businessRecord = await business.findOne({ email });
    if (!businessRecord) {
      return sendResponse(res, 404, 'Business not found.');
    }

    if (businessRecord.isVerified) {
      return sendResponse(res, 400, 'Business is already verified.');
    }

    // Generate a new verification token
    const newToken = generateVerificationToken();
    const tokenExpiration = moment().add(5, 'minutes');

    businessRecord.verificationToken = newToken;
    businessRecord.tokenExpiration = tokenExpiration;

    await businessRecord.save();

    // Send the new verification link with the new token
    const verificationLink = `https://esportee.com/verify/${newToken}`;
    await sendEmailService(email, 'Email Verification', `Click the following link to verify your business: ${verificationLink}`);

    return sendResponse(res, 200, 'New verification link has been sent to your email.');
  } catch (error) {
    console.error("Error regenerating verification token:", error);
    sendResponse(res, 500, "Failed to regenerate verification token", null, [error.message]);
  }
};



/*Create Business Catalogue */
exports.createCatalogue = async (req, res) => {
  try {
    const businessId = req.body.businessId;

    const Business = await business.findOne({ _id: businessId, isVerified: true });
    if (!Business) {
      return sendResponse(res, 401, 'Unauthorized: Business not registered or not verified.');
    }

    const existingCatalogue = await BusinessCatalogue.findOne({
      businessId,
      deleted: false
    });

    if (existingCatalogue) {
      if (existingCatalogue.deleted) {

        const newCatalogue = new BusinessCatalogue({
          businessId,
          businessName: Businessusiness.businessName,
          businessWebsite: Business.businessWebsite,
          email: Business.email,
          ...req.body
        });
        await newCatalogue.save();

        return sendResponse(res, 201, 'Catalogue created successfully.', newCatalogue);
      } else {
        return sendResponse(res, 400, 'Business has already created a Catalogue.');
      }
    } else {
      const newCatalogue = new BusinessCatalogue({
        businessId,
        businessName: Business.businessName,
        businessWebsite: Business.businessWebsite,
        email: Business.email,
        ...req.body
      });
      await newCatalogue.save();

      return sendResponse(res, 201, 'Catalogue created successfully.', newCatalogue);
    }
  } catch (error) {
    console.error('Error creating Catalogue:', error);
    sendResponse(res, 400, 'Failed to create', null, [error.message]);
  }
};


/*Business profile */
// exports.businessImageUpload = (req, res) => {
//     if (false) {
//         return sendResponse(req, res, 400, "Session Expire");
//     } else {
//         try {
//             singleUpload(req, res, function(err) {
//                 if (err) {
//                     return sendResponse(
//                         req,
//                         res,
//                         400,
//                         "error to upload image"
//                     );
//                 } else {
//                     var business_id = req.body.business_id;
//                     var query = { _id: ObjectId(business_id) };
//                     console.log(`body`, req.body);
//                     console.log(`query`, query);
//                     console.log(`file`, req.file);
//                     if (req.file) {
//                         var business_image = req.file.location;
//                         Jobseeker.UserSchema.updateOne(query, {
//                             $set: { business_image_url: business_image },
//                         }).exec((err, result) => {
//                             if (err) {
//                                 console.log(err.message);
//                                 return sendResponse(
//                                     req,
//                                     res,
//                                     400,
//                                     "error to upload image"
//                                 );
//                             } else {
//                                 data = {
//                                     status: 200,
//                                     message: "Image upload successfully",
//                                     image_url: req.file.location,
//                                 };
//                                 // if (process.env.NODE_ENV === "") {
//                                 //     index
//                                 //         .partialUpdateObject({
//                                 //             business_image_url: req.file.location,
//                                 //             objectID: business_id,
//                                 //         })
//                                 //     .then(({ objectID }) => {
//                                 //         console.log(objectID);
//                                 //     })
//                                 //     .catch((err) => console.log(err.message));
//                                 // }
//                                 // return functions.sendResponse(req, res, data);
//                             }
//                         });
//                     } else {
//                         return sendResponse(
//                             req,
//                             res,
//                             400,
//                             "Please upload the image, (business img)"
//                         );
//                     }
//                 }
//             });
//         } catch (error) {
//             console.log(error.message);
//             return sendResponse(req, res, 500, "Some error occured");
//         }
//     }
// };


/** read business profiles  */
exports.getBusinessCatalogue = async (req, res) => {
    try {
        let { offset, limit } = req.query;
        offset = Math.max(parseInt(offset) || 0, 0);
        limit = Math.max(parseInt(limit) || 10, 10);

        const businesses = await BusinessCatalogue
        .aggregate([
            { $match: {deleted: false} },
            {
                $project: {
                    _id: 0,
                    businessName: "$businessName",
                    otherName: "$otherName",
                    email: "$email",
                    mobile: "$mobile",
                    businessWebsite: "$businessWebsite",
                    description: "$description",
                    businessSize: "$businessSize",
                    businessHQLocation: "$businessHQLocation",
                    language: "$language",
                    yearFounded: "$yearFounded",
                    companyType: "$businessType",
                    otherAccounts: "$otherAccounts",
                    updatedAt: "$updatedAt",
                    deleted: "$deleted",
                },
            },
            {
                $sort: {
                    updatedAt : -1
                }
            },
            {$facet : {
                businesses : [{$skip : offset}, {$limit : limit}],
                totalCount : [{$count : 'count'}]
            }}
        ]).exec(); 
        return sendResponse(res, 200, "Catalogue profiles fetched successfully", businesses);
    } catch (error) {
      console.error("Error fetching Catalogue profile: ", error);
      sendResponse(res, 500, "Failed to fetch", null, [error.message ]);
    }
};

/** read catalogue profiles by Id */
exports.getCatalogueByID = async (req, res) => {
    try {
        let _id = req.params;
        let businesses = await BusinessCatalogue.findOne({ _id, deleted: false });
        if (!businesses) {
          return sendResponse(res, 404, "Business catalogue profile not found");
        } else {
          return sendResponse(res, 200, "Business catalogue profile fetched successfully", businesses);
        }
    }
    catch (error) {
        console.error("Error fetching business profile: ", error);
        sendResponse(res, 500, "Failed to fetch", null, [
            error.message,
        ]);
    }
};    

/** update business profiles */
exports.updateCatalogue = async(req, res)=>{
    try {
        let _id = req.params;
        let isExists = await BusinessCatalogue.findOne({ _id , deleted: false});
        if (!isExists) throw { message: "Business catalogue has not added yet" };

        const { businessName, businessWebsite, email, ...updateFields } = req.body;

        if (businessName || businessWebsite || email) {
          return sendResponse(res, 400, "Cannot update businessName, businessWebsite or email");
        }

        const businesses = await BusinessCatalogue.updateOne({ _id }, { $set: updateFields }, { new: true });
        return sendResponse(res, 200, "business catalogue updated successfully", businesses);        
    } catch (error) {
      console.error("Error updating catalogue:", error);
      sendResponse(res, 500, "Failed to update catalogue", null, [error.message]);
    }
};

/** delete business profiles by Id */
exports.deleteCatalogue = async (req, res) => {
    try {
        let _id = req.params;
        let businesses = await BusinessCatalogue.findByIdAndUpdate( _id, { deleted: true }, { new: true } );
        if (!businesses) {
          return sendResponse(res, 404, "catalogue not found");
          }
          return sendResponse(res, 200, "catalogue deleted successfully");
    } catch (error) {
      console.error("Error deleting catalogue:", error);
      sendResponse(res, 500, "Failed to delete catalogue", null, [error.message]);
    }
};

/* Search business by name */
exports.searchBusinesses = async (req, res) => {
  const { businessName } = req.query; 
  try {
    const query = {deleted: { $ne: true } };

    if (businessName) {
      query.businessName = { $regex: new RegExp(`^${businessName}$`, 'i') };
    }

    const businesses = await BusinessCatalogue.find(query);
    return sendResponse(res, 200, 'Businesses found successfully.', businesses);
  } catch (error) {
    console.error("Error searching and filtering businesses:", error);
    sendResponse(res, 500, "Failed to search and filter businesses", null, [error.message]);
  }
};