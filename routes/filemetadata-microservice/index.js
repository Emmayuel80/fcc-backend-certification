const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
router.post("/", upload.single("upfile"), (req, res) => {
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
  });
});

router.get("/", (req, res) => {
  res.send(`
    <form action="/api/fileanalyse" method="post" enctype="multipart/form-data">
        <input type="file" name="upfile" />
        <input type="submit" value="Submit" />
    </form>
  `);
});

module.exports = router;
