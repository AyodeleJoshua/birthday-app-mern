const { PORT, MONGODB_CONNECTION_STRING, DB_NAME } = process.env;

const getEvnvironmentVariables = {
  port: PORT || 8080,
  mongodbConnectionString: MONGODB_CONNECTION_STRING,
  dbName: DB_NAME || "birthday",
};

module.exports = getEvnvironmentVariables;
