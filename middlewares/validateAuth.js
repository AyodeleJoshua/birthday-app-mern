const { body } = require("express-validator");

const User = require("../models/user");

exports.validateSignUp = [
  body("firstName")
    .trim()
    .isLength({ min: 3 })
    .withMessage("first name too short"),
  body("lastName")
    .trim()
    .isLength({ min: 3 })
    .withMessage("first name too short"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter valid email.")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject("E-Mail already exists!");
        }
      });
    })
    .normalizeEmail(),
  body("password").trim().isLength({ min: 5 }),
  body("dob", "dob can only be in DD-MM format")
    .trim()
    .isLength({ max: 5, min: 5 })
    .custom((value, { req }) => {
      return new RegExp(/(^0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2]$)/).test(
        value
      );
    }),
];

exports.validateLogin = [
  body("password", "Password cannot be empty").notEmpty(),
  body("email", "Invalid email!").isEmail(),
];
