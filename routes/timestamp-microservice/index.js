const express = require("express");
const router = express.Router();

router.get("/:date", (req, res) => {
  const date = req.params.date;
  const dateObject = new Date(date);
  const unix = dateObject.getTime();
  const utc = dateObject.toUTCString();
  if (utc === "Invalid Date") {
    res.json({ error: "Invalid Date" });
  } else {
    res.json({ unix, utc });
  }
});

module.exports = router;
