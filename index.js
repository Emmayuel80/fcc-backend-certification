const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");
const fs = require("fs");
const app = express();
const port = 7569;
dotenv.config();

mongoose.connect(process.env.MONGO_URI);
mongoose.set("debug", true);

app.use(
  cors({
    origin: "https://www.freecodecamp.org",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.enable("trust proxy");
app.use(helmet());
app.use(require("morgan")("combined"));
app.disable("x-powered-by");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Models
require("./models/URL");
require("./models/User");

// Routes
app.use("/api/users", require("./routes/exercise-tracker"));
app.use("/api/shorturl", require("./routes/urlshortener-microservice"));
app.use("/timestamp/api/", require("./routes/timestamp-microservice"));
app.use("/api/whoami", require("./routes/requestheaderparser-microservice"));
app.use("/api/fileanalyse", require("./routes/filemetadata-microservice"));

app.get("/", (req, res) => {
  res.send(`
    <form action="/api/fileanalyse" method="post" enctype="multipart/form-data">
        <input type="file" name="upfile" />
        <input type="submit" value="Submit" />
    </form>
  `);
});

if (process.env.PRODUCTION) {
  const privateKey = fs.readFileSync(
    `/etc/letsencrypt/live/${process.env.DOMAIN}/privkey.pem`,
    "utf8"
  );
  const certificate = fs.readFileSync(
    `/etc/letsencrypt/live/${process.env.DOMAIN}/cert.pem`,
    "utf8"
  );
  const https = require("https");
  const credentials = { key: privateKey, cert: certificate };
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} else {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
