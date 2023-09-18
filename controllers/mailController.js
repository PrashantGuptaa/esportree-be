const { get } = require("lodash");
const sendEmail = require("../services/mailer");
const sendResponse = require("../utils/response");
const User = require("../models/users.model");

// Generate a random verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const getVericationEmailSubject = () => "Verification Code for 2FA";

const getVericationEmailBody = (verificationCode) =>
  `Your verification code is: ${verificationCode}`;

// Store verification codes temporarily (In a production app, use a database)
const verificationCodes = {};

const sendVerficationEmailController = async (req, res) => {
  const { logger } = req;
  try {
    const email = get(req.user, ["email"], "");
    console.log(email);
    const startTime = Date.now();
    logger.info(`Sending verfication code to email: ${email}`);
    const otp = generateVerificationCode();
    await User.findByIdAndUpdate(req.userId, {
      otp,
      otpValidity: Date.now() + 3 * 60 * 1000,
    }); // 3 mins validity

    await sendEmail(
      email,
      getVericationEmailSubject(),
      getVericationEmailBody(otp)
    );
    logger.info(
      `Successfully sent otp to email: ${email}. Time Taken: ${
        (Date.now() - startTime) / 1000
      } sec`
    );
    sendResponse(res, 200, "Successfully sent otp to email", null);
  } catch (e) {
    logger.error(`Error while sending email: ${e.message}`);
    sendResponse(res, 500, "Error while sending email for verification", null, [
      e.message,
    ]);
  }
};

const verifyOtpController = async (req, res) => {
  const { logger } = req;

  try {
    const otp = get(req.body, ["otp"], "");
    logger.info(`Verifying Otp`);
    
    let userDetails = await User.findById(req.userId);
    //console.log("F-4", userDetails);
  
    if (
      userDetails.otp !== Number(otp) ||
      Date.now() - userDetails.otpValidity > 0
    ) {
      
      return sendResponse(res, 403, "Invalid OTP", null);
      
    }
   
    //console.log('Hi')
    userDetails.active=true;
    await userDetails.save();
    
    logger.info(`Successfully verified email and enabled user: ${req.userId}`);
    return sendResponse(res, 200, "Successfully verified otp", null);
  } catch (e) {
    logger.error(`Error while sending email: ${e.message}`);
    return sendResponse(res, 500, "Error while sending email for verification", null, [
      e.message,
    ]);
  }
};

module.exports = {
  sendVerficationEmailController,
  verifyOtpController,
};

// hilznqhclxdoilqx
