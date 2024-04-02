const express = require("express");
const router = express.Router();

router.get("/:date?", (req, res) => {
  const date = req.params.date;

  const dateObject = new Date(isNaN(date) ? date : Number(date));
  const unix = dateObject.getTime();
  const utc = dateObject.toUTCString();
  console.log(dateObject);
  if (utc === "Invalid Date") {
    res.json({ error: "Invalid Date" });
  } else {
    res.json({ unix, utc });
  }
});

module.exports = router;
