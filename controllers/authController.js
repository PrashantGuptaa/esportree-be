// authController.js
const { get } = require("lodash");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables from .env
const sendResponse = require("../utils/response");

const {
  generateToken,
  getWelcomeEmailSubject,
  getWelcomeEmailBody,
} = require("../utils/authUtils");

const User = require("../models/users.model");
const { logger, setUserContext } = require("../services/logService");
const { sendEmailService } = require("../services/emailService");
const { sendOtpService } = require("../services/authService");

const signUp = async (req, res) => {
  try {
    const startTime = Date.now();
    setUserContext(req.body || {});
    logger.info("Registering User");
    const { email, password, userName, name } = req.body;

    const existingUserWithEmail = await User.findOne({ email });

    if (existingUserWithEmail) {
      return sendResponse(res, 400, "Email is already registered.");
    }

    // if (JSON.parse(process.env.ENABLE_EMAIL_VALIDATION || false)) {
    //   const { valid, reason, validators } = await emailValidator.validate(
    //     email
    //   );
    //   if (!valid) {
    //     return sendResponse(
    //       res,
    //       400,
    //       `Please provide a valid email address. Reason: ${validators[reason].reason}`
    //     );
    //   }
    // }

    const existingUserWithUserName = await User.findOne({ userName });

    if (existingUserWithUserName) {
      return sendResponse(res, 400, "User name is already registered.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPassword, userName, name });
    await user.save();
    const { _id: userId, role, active } = user;
    const token = generateToken(userId, email, role, active, name, "12h"); // Generate a token with userId, email, and role


    sendOtpService({ userId, email, role, name });

    logger.info(
      `Registered User. Time Taken: ${(Date.now() - startTime) / 1000}s`
    );
    return sendResponse(res, 201, "User registration successful.", { token });
  } catch (error) {
    console.error(error);
    return sendResponse(
      res,
      500,
      `Error while registering user: ${error.message}`
    );
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.info(`Logging email: ${email}`);

    if (!email || !password) {
      return sendResponse(
        res,
        401,
        "Authentication failed. Email and password are mandatory fields."
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return sendResponse(
        res,
        401,
        "Authentication failed. Email is not registered."
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return sendResponse(
        res,
        401,
        "Authentication failed. Invalid credentials."
      );
    }

    const { _id: userId, role, active, name } = user;

    const token = generateToken(userId, email, role, active, name, "12h"); // Generate a token with userId, email, and role
    logger.info(`Logged user with email: ${email}`);

    if (!active) {
      sendOtpService({ userId, role, email, name });
    }

    return sendResponse(res, 200, "Authentication successful.", {
      token,
      active,
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, "Error while logging in");
  }
};

const sendOtpToUser = async (req, res) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization;

    if (!token) {
      return sendResponse(res, 401, "Authentication failed. Token is missing.");
    }

    jwt.verify(token, process.env.AUTH_TOKEN, async (err, user) => {
      if (err) {
        console.error(err.message);
        return sendResponse(res, 401, "Authentication failed. Invalid token.");
      }

      await sendOtpService(user);

      return sendResponse(res, 201, "OTP sent to user successfully.");
    });
  } catch (e) {
    const m = `Error while sending OTP: ${e.message}`;
    logger.error(m);
    return sendResponse(res, 500, m);
  }
};

const verifyOtpFromUser = async (req, res) => {
  try {
    logger.info(`Verifying OTP for user`);
    const { otp, token } = req.body;

    if (!otp) {
      return sendResponse(res, 401, "Authentication failed. OTP is missing.");
    }

    if (!token) {
      return sendResponse(res, 401, "Authentication failed. Token is missing.");
    }

    jwt.verify(token, process.env.AUTH_TOKEN, async (err, user) => {
      if (err) {
        return sendResponse(res, 401, "Authentication failed. Please login again.");
      }

      console.log("user", user)

      const { userId, email, role, name } = user;
      const userData = await User.findById(userId);

      const { otp: otpDetails } = userData;
      const lastInd = otpDetails.lastIndexOf("_");

      const hashedOtp = otpDetails.slice(0, lastInd);
      const validity = otpDetails.slice(lastInd + 1);

      if (validity < Date.now()) {
        return sendResponse(res, 400, "OTP no longer valid.");
      }

      const isOtpValid = await bcrypt.compare(otp, hashedOtp);

      if (isOtpValid) {
        await User.findByIdAndUpdate(userId, { active: true });
        await sendEmailService(
          email,
          getWelcomeEmailSubject(name),
          getWelcomeEmailBody()
        );
        return sendResponse(res, 200, "OTP verification successful.", {
          token: generateToken(userId, email, role, true, name, "12h"),
        });
      }

      return sendResponse(res, 400, "OTP verification failed. Invalid OTP.");
    });
  } catch (e) {
    console.error(e);
    const m = `Error while verifying OTP: ${e.message}`;
    logger.error(m);
    return sendResponse(res, 500, m);
  }
};

module.exports = {
  signUp,
  login,
  sendOtpToUser,
  verifyOtpFromUser,
};
