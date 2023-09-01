const bcrypt = require("bcrypt");
const sendResponse = require("../utils/response");
const { businessSchema } = require("../models/business.model");
var aws = require("aws-sdk");
var multer = require("multer");
var multerS3 = require("multer-s3");

/*AWS Connection*/

// aws.config.update({
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     region: process.env.AWS_REGION,
//     s3BucketEndpoint: true,
//     endpoint: process.env.AWS_BUCKET_ENDPOINT,
// });

// var s3 = new aws.S3();
// var upload = multer({
//     storage: multerS3({
//         s3: s3,
//         acl: "public-read",
//         bucket: process.env.AWS_BUCKET_NAME,
//         metadata: function(req, file, cb) {
//             cb(null, { fieldName: "business_Profile_img" });
//         },
//         key: function(req, file, cb) {
//             var filename =
//                 "public/" + Date.now().toString() + "_" + file.originalname;
//             cb(null, filename);
//         },
//     }),
// });
// var singleUpload = upload.single("business_image");



/*Register Business Profile*/
exports.registerBusiness = async (req, res) => {
    try{
        var businessName = req.body.businessName;
        var otherName = req.body.otherName;
        var businessWebsite = req.body.businessWebsite;
        var businessSize = req.body.businessSize;
        var businessHQLocation = req.body.businessHQLocation;
        var language = req.body.language;
        var yearFounded = req.body.yearFounded;
        var businessType = req.body.businessType;
        
        if (!businessName || !otherName || !businessWebsite || !businessSize || !businessHQLocation || !language || !yearFounded || !businessType) {
            sendResponse(res, 400, 'Missing required fields');
            return;
        }
        
        const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
        // Check if businessWebsite matches the URL format
        if (!urlRegex.test(businessWebsite)) {
            // If it doesn't match, handle the validation error
            sendResponse(res, 400, 'Invalid businessWebsite format');
            return;
        }
        
        let isExists = await businessSchema.findOne({ businessName: req.body.businessName });
        if (isExists) throw { message: "You have already registered" };
        
        let newBusiness = new businessSchema({
            businessName: businessName,
            otherName: otherName,
            businessWebsite: businessWebsite,
            businessSize: businessSize,
            businessHQLocation: businessHQLocation,
            language: language,
            yearFounded: yearFounded,
            businessType: businessType
        });
        await newBusiness.save();
        sendResponse(res, 201, "Registered successfully");
    }catch (error) {
      console.error("Error creating business:", error);
      sendResponse(res, 400, "Failed to register", null, [error.message]);
    } 
};


/*Business profile */
// exports.BusinessImageUpload = (req, res) => {
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
exports.GetBusinessProfiles = async (req, res) => {
    try {

        const businesses = await businessSchema
        .aggregate([
            {
                $project: {
                    _id: 0,
                    businessName: "$businessName",
                    otherName: "$otherName",
                    businessWebsite: "$businessWebsite",
                    businessSize: "$businessSize",
                    businessHQLocation: "$businessHQLocation",
                    language: "$language",
                    yearFounded: "$yearFounded",
                    businessType: "$businessType",
                    createdAt: "$createdAt",
                },
            },
            {
                $sort: {
                    createdAt : -1
                }
            },
        ]).exec(); 
        sendResponse(res, 200, "Business profiles fetched successfully", businesses);
    } catch (error) {
        console.error("Error fetching business profile: ", error);
        sendResponse(res, 500, "Failed to fetch", null, [
            error.message,
        ]);
    }
};
