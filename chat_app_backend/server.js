// main entry point for the application
const express = require("express");
const bodyParser = require("body-parser");
// add cors middleware
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/auth");
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
