const mongoose = require("mongoose");

const {
  mongodbConnectionString,
  dbName,
} = require("./getEnvironmentVariables");

const dbConnection = (cb) => {
  mongoose
    .connect(mongodbConnectionString, { dbName })
    .then(() => {
      cb();
    })
    .catch((err) => {
      console.log("Cannot connect to db");
      console.log(err);
    });
};

module.exports = dbConnection;
