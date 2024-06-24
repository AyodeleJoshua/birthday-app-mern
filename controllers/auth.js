const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const { responseError, handleResponse } = require("../utils");
const User = require("../models/user");
const { signup, login } = require("../services/authServices");

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const amendedError = errors.array().map((error) => ({
        msg: error.msg,
        value: error.value,
      }));
      responseError("Validation failed.", 422, amendedError);
    }
    const regisiteredUser = await signup(req);
    handleResponse(
      res,
      201,
      "User successfully created!",
      regisiteredUser._id,
      "userId"
    );
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const amendedError = errors.array().map((error) => ({
        msg: error.msg,
        value: error.value,
      }));
      responseError("Validation failed.", 422, amendedError);
    }
    const { token, userId } = await login(req);
    handleResponse(res, 200, "Login Successful!", { token, userId });
  } catch (err) {
    next(err);
  }
};
