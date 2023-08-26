// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users.model");
const sendResponse = require("../utils/response");

// Handle user sign-up
const signUp = async (req, res) => {
  try {
    const { userName, email, password, name } = req.body;
        // Check if the userName, email, and password are provided
        if (!userName || !email || !password) {
          sendResponse(res, 400, 'Username, email, or password is missing');
          return;
        }
    // Check if the userName or email already exist
    const existingUser = await User.findOne({ $or: [{ userName }, { email }] });

    if (existingUser) {
      sendResponse(res, 400, "Username or email already exists");
      return;
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userName,
      email,
      name,
      password: hashedPassword,
    });

    await newUser.save();
    // Generate and sign a JWT token for the newly registered user
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.AUTH_PRIVATE_KEY,
      {
        expiresIn: "24h",
        algorithm: 'HS256', // Use the desired algorithm

      }
    );

    sendResponse(res, 201, "User registered successfully", { token });
  } catch (error) {
    console.error("Error signing up:", error);
    sendResponse(res, 400, "Failed to sign up", null, [error.message]);
  }
};

// Handle user login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      sendResponse(res, 404, "User not found");
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      sendResponse(res, 401, "Invalid password");
      return;
    }

    // Generate and sign a JWT token for the user
    const token = jwt.sign({ userId: user._id }, process.env.AUTH_PRIVATE_KEY, {
      expiresIn: "24h", // Token expiration time
      algorithm: 'HS256', // Use the desired algorithm
    });

    sendResponse(res, 200, "Login successful", { token });
  } catch (error) {
    console.error("Error during login:", error);
    sendResponse(res, 500, "Login failed", null, [error.message]);
  }
};

module.exports = {
  signUp,
  login,
};
