const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const URL = mongoose.model("URL");
const URLVerificator = require("../../services/URLVerificator");

router.post("/", async (req, res) => {
  const original_url = req.body.url;

  // verify if the URL is valid
  if (!URLVerificator(original_url)) return res.json({ error: "invalid URL" });

  const short_url = (await URL.countDocuments()) + 1;

  await URL.create({ original_url, short_url });
  res.json({ original_url, short_url });
});

router.get("/:short_url", async (req, res) => {
  const short_url = req.params.short_url;

  // verify if short_url is valid
  if (isNaN(short_url))
    return res.json({ error: "No short URL found for the given input" });

  const url = await URL.findOne({ short_url });
  if (!url)
    return res.json({ error: "No short URL found for the given input" });

  res.redirect(url.original_url);
});

module.exports = router;
