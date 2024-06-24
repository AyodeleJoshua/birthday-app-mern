require("dotenv").config();

const {
  PORT,
  MONGODB_CONNECTION_STRING,
  DB_NAME,
  SERVICE_PREFIX,
  API_VERSION,
  JWT_SECRET_KEY,
} = process.env;

const getEvnvironmentVariables = {
  port: PORT || 8080,
  mongodbConnectionString: MONGODB_CONNECTION_STRING,
  dbName: DB_NAME || "birthday",
  endpointPrefix: SERVICE_PREFIX || "",
  version: API_VERSION || "v1",
  jwtSecret: JWT_SECRET_KEY,
};

module.exports = getEvnvironmentVariables;
