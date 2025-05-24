const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const path = require("path");

router.post("/", (req, res) => {
  const inputData = req.body;

  // Construct the path to the Python script
  const pythonScriptPath = path.join(__dirname, "../scripts/run_prophet.py");

  // Spawn a Python child process
  const python = spawn("python", [pythonScriptPath, JSON.stringify(inputData)]);

  let result = "";

  // Collect output from Python
  python.stdout.on("data", (data) => {
    result += data.toString();
  });

  // Handle script completion
  python.on("close", (code) => {
    try {
      const prediction = JSON.parse(result);
      res.json(prediction);
    } catch (err) {
      console.error("Prediction failed:", err);
      res.status(500).json({ error: "Prediction failed." });
    }
  });

  // Log Python errors
  python.stderr.on("data", (data) => {
    console.error("Python error:", data.toString());
  });
});

module.exports = router;
