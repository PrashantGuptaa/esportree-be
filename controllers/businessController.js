const bcrypt = require("bcrypt");
const sendResponse = require("../utils/response");
const business  = require("../models/business.model");
// var aws = require("aws-sdk");
// var multer = require("multer");
// var multerS3 = require("multer-s3");

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
        let isExists = await business.findOne({ businessName: req.body.businessName });
        if (isExists) throw { message: "You have already registered" };
        
        let newBusiness = await business.create({userId: req.userId, ...req.body});
        return sendResponse(res, 201, {message: "Registered successfully", data: newBusiness});        

    }catch (error) {
      console.error("Error creating business:", error);
      sendResponse(res, 400, "Failed to register", null, [error.message]);
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
exports.getBusinessProfiles = async (req, res) => {
    try {
        let { offset, limit } = req.query;
        offset = parseInt(offset);
        limit = parseInt(limit);
        offset = offset >= 0 ? offset : 0;
        limit = limit >= 10 ? limit : 10;

        const businesses = await business
        .aggregate([
            { $match: {deleted: false} },
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
                    updatedAt: "$updatedAt",
                    deleted: "$deleted"
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
        sendResponse(res, 200, "Business profiles fetched successfully", businesses);
    } catch (error) {
        console.error("Error fetching business profile: ", error);
        sendResponse(res, 500, "Failed to fetch", null, [
            error.message,
        ]);
    }
};

/** read business profiles by Id */
exports.getBusinessByID = async (req, res) => {
    try {
        let _id = req.params;
        let businesses = await business.findOne({ _id, deleted: false });
        if (!businesses) {
            sendResponse(res, 404, "Business profile not found");
        } else {
            sendResponse(res, 200, "Business profile fetched successfully", businesses);
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
exports.updateBusiness = async(req, res)=>{
    try {
        let _id = req.params;
        let isExists = await business.findOne({ _id , deleted: false});
        if (!isExists) throw { message: "Business has not added yet" };
        let businesses =  await business.updateOne({_id }, {$set : req.body}, { new: true } );
        sendResponse(res, 200, "business updated successfully", businesses);        

    } catch (error) {
        console.error("Error updating business:", error);
        sendResponse(res, 500, "Failed to update business", null, [error.message]);
      }
};

/** delete business profiles by Id */
exports.deleteBusiness = async (req, res) => {
    try {
        let _id = req.params;
        let businesses = await business.findByIdAndUpdate( _id, { deleted: true }, { new: true } );
        if (!businesses) {
            sendResponse(res, 404, "business not found");
            return;
          }
          sendResponse(res, 200, "business deleted successfully");
        } catch (error) {
          console.error("Error deleting business:", error);
          sendResponse(res, 500, "Failed to delete business", null, [error.message]);
        }
};