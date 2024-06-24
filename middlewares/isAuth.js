const jwt = require("jsonwebtoken");
const { responseError } = require("../utils");
const { jwtSecret } = require("../utils/getEnvironmentVariables");

const isAuth = (req, res, next) => {
  const autorizationHeader = req.get("Authorization");
  if (!autorizationHeader) {
    throw responseError("Not authenticated!", 401);
  }

  const jwtToken = autorizationHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(jwtToken, jwtSecret);
  } catch (err) {
    throw responseError("Not authenticated or expired token!", 401);
  }
  if (!decodedToken) {
    throw responseError("Not authenticated!", 401);
  }

  req.userId = decodedToken.userId;

  next();
};

module.exports = isAuth;
