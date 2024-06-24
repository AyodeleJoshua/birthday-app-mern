const { body } = require("express-validator");
const Contact = require("../models/contact");

exports.validateCreateContact = [
  body("firstName")
    .trim()
    .isLength({ min: 3 })
    .withMessage("first name too short"),
  body("lastName")
    .trim()
    .isLength({ min: 3 })
    .withMessage("last name too short"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter valid email.")
    .custom(async (email, { req }) => {
      const alreadyExistingContact = await Contact.findOne({
        email,
        owner: req.userId,
        isDeleted: false,
      });

      if (alreadyExistingContact) {
        return Promise.reject("Contact with email already exist!");
      }
    }),
  body("dob", "dob can only be in DD-MM format")
    .trim()
    .isLength({ max: 5, min: 5 })
    .custom((dob, { req }) => {
      return new RegExp(/(^0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2]$)/).test(dob);
    }),
  body("phoneNumber")
    .trim()
    .custom((phoneNumber) => {
      const regex = new RegExp("^[0-9]{10,14}$");
      return regex.test(phoneNumber);
    })
    .withMessage("Invalid Phone number!"),
];

exports.validateEditContact = [
  body("firstName")
    .trim()
    .optional()
    .isLength({ min: 3 })
    .withMessage("first name too short"),
  body("lastName")
    .trim()
    .optional()
    .isLength({ min: 3 })
    .withMessage("last name too short"),
  body("email")
    .trim()
    .optional()
    .isEmail()
    .withMessage("Please enter valid email.")
    .custom(async (email, { req }) => {
      const alreadyExistingContact = await Contact.findOne({
        email,
        owner: req.userId,
        isDeleted: false,
      });

      if (alreadyExistingContact) {
        return Promise.reject("Contact with email already exist!");
      }
    }),
  body("dob", "dob can only be in DD-MM format")
    .trim()
    .optional()
    .isLength({ max: 5, min: 5 })
    .custom((dob, { req }) => {
      return new RegExp(/(^0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2]$)/).test(dob);
    }),
  body("phoneNumber")
    .trim()
    .optional()
    .custom((phoneNumber) => {
      const regex = new RegExp("^[0-9]{10,14}$");
      return regex.test(phoneNumber);
    })
    .withMessage("Invalid Phone number!"),
];
