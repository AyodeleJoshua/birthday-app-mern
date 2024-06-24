const express = require("express");
const bodyParser = require("body-parser");

const { endpointPrefix, version } = require("./getEnvironmentVariables");
const authRoutes = require("../routes/auth");
const contactRoutes = require("../routes/contact");

const createServer = () => {
  const app = express();
  const routePrefix = `${endpointPrefix}/${version}`;

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTION"
    );
    next();
  });

  app.use(`/${routePrefix}/auth`, authRoutes);
  app.use(`/${routePrefix}/contact`, contactRoutes);

  app.use((req, res, next) => {
    res.status(404).json({ message: `Cannot find ${req.method} ${req.path}` });
  });

  app.use((error, req, res, next) => {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message, data: error.data });
  });

  return app;
};

module.exports = createServer;
