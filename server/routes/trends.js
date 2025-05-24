const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const path = require("path");

router.post("/", (req, res) => {
  const input = req.body;

  const pyProcess = spawn("python", [
    path.join(__dirname, "../scripts/generate_graph_data.py"),
  ]);

  let result = "";
  pyProcess.stdin.write(JSON.stringify(input));
  pyProcess.stdin.end();

  pyProcess.stdout.on("data", (data) => {
    result += data.toString();
  });

  pyProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  pyProcess.on("close", () => {
    try {
      res.json(JSON.parse(result));
    } catch (e) {
      res.status(500).send("Failed to parse Python response");
    }
  });
});

module.exports = router;
