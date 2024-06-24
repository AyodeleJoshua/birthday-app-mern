const mongoose = require("mongoose");

const {
  mongodbConnectionString,
  dbName,
} = require("./getEnvironmentVariables");

const dbConnection = async (cb) => {
  try {
    await mongoose.connect(mongodbConnectionString, {
      dbName,
    });
    cb();
  } catch (err) {
    console.log("Cannot connect to db");
    console.log(err);
  }
};

module.exports = dbConnection;
