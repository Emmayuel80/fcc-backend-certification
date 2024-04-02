const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");
const app = express();
const port = 7569;
dotenv.config();

mongoose.connect(process.env.MONGO_URI);
mongoose.set("debug", true);

// Models
require("./models/URL");
require("./models/User");

// Routes
app.use("/api/users", require("./routes/exercise-tracker"));

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.use(cors());
app.enable("trust proxy");
app.use(helmet());
app.use(require("morgan")("combined"));
app.disable("x-powered-by");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
