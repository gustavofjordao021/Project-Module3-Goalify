require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

require("./configs/db.config");
require("./configs/session.config")(app);
require("./configs/passport/passport.config.js")(app);

app.use(
  cors({
    origin: process.env.REACT_APP_CLIENT_POINT,
    credentials: true,
  })
);

// Route setup
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/app", require("./routes/application"));

module.exports = app;
