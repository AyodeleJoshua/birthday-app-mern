const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const {
  mongodbConnectionString,
  dbName,
  port,
} = require("./utils/getEnvironmentVariables");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTION"
  );
  next();
});


app.use((req, res, next) => {
  res.status(404).json({ message: `Cannot find ${req.method} ${req.path}` });
});

app.use((error, req, res, next) => {
  res
    .status(error.statusCode || 500)
    .json({ message: error.message, data: error.data });
});

mongoose
  .connect(mongodbConnectionString, { dbName })
  .then(() => {
    return app.listen(port);
  })
  .then(() => {
    console.log(`Birthday app listening on port ${port}`);
  })
  .catch((err) => {
    console.log("Cannot connect to db");
    console.log(err);
  });
