// app.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env

const app = express();
const logger = require("./services/logger");
const requestIdMiddleware = require("./middlewares/requestMiddleware");

const routes = require("./routes");

const port = process.env.APP_PORT;
const mongoUrl = process.env.MONGO_CONNECTION;

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestIdMiddleware);

// Routes
app.get("/", (req, res) => {
  res.send("Welcome! This route is working");
});

// Connect to MongoDB using Mongoose
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    // Define more routes and interact with the database here
    // Use the routes configuration from routes/index.js
    app.use("/", routes);

    // Start the server after connecting to MongoDB
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
