const express = require("express");
const morgan = require("morgan");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

// Setup static folder
app.use("/public/", express.static("public/"));

// Setup Third party
app.use(cors());
app.use(morgan("dev"));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// Connect to mongo db

require("./config/mongo");

// Handle Router
const router = require("./api/routers");

app.use("/users", router.USERS_ROUTER);
app.use("/message", router.MESSAGE_ROUTER);

// Handle not found endpoint
app.use((req, res, next) => {
  const err = new Error("End point not found");
  err.status = 404;
  next(err);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
