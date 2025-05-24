const express = require("express");
const router = express.Router();
const csv = require("csv-parser");
const fs = require("fs");

const filePath = "./data/synthetic_agriculture_market_data.csv";

router.get("/options", (req, res) => {
  const states = new Set();
  const markets = new Set();
  const commodities = new Set();

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      states.add(row.State);
      markets.add(row.Market);
      commodities.add(row.Commodity);
    })
    .on("end", () => {
      res.json({
        states: [...states],
        markets: [...markets],
        commodities: [...commodities],
      });
    });
});

module.exports = router;
