const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { jwtSecret } = require("../utils/getEnvironmentVariables");
const { responseError, serviceErrorHandler } = require("../utils");

exports.signup = async (req) => {
  const { email, firstName, lastName, dob, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      dob,
    });
    return user.save();
  } catch (err) {
    serviceErrorHandler(err);
  }
};

exports.login = async (req) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw responseError("Incorrect email or password!", 401);
    }
    const isPasswordMatch = bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw responseError("Incorrect email or password!", 401);
    }

    const token = jwt.sign(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.lastName,
        userId: user._id,
      },
      jwtSecret,
      { expiresIn: "1h" }
    );
    return { token, userId: user._id };
  } catch (err) {
    serviceErrorHandler(err);
  }
};
