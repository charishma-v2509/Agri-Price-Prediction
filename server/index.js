// server/index.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Import routes
const predictRoute = require("./routes/predict");
const optionsRoute = require("./routes/options");
const trendsRoute = require("./routes/trends");

// Use routes
app.use("/api/predict", predictRoute);
app.use("/api/trends", trendsRoute);
app.use("/api", optionsRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
