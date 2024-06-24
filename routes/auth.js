const express = require("express");

const { signup, login } = require("../controllers/auth");
const {
  validateSignUp,
  validateLogin,
} = require("../middlewares/validateAuth");

const router = express.Router();

router.put("/signup", validateSignUp, signup);

router.post("/login", validateLogin, login);

module.exports = router;
