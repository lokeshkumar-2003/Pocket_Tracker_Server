const User = require("../../Model/User.js");
const validator = require("validator");
const { JsonToken } = require("../../Util/JsonToken.js");
const { hashPassword } = require("../../Util/Auth.js");

module.exports.Signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter all the fields",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Ensure that hashPassword is awaited if it's a promise
    let hashedPass = await hashPassword(password); // <-- Await if async

    // Create user with correct field name for password
    const user = await User.create({
      username,
      email,
      password: hashedPass, // <-- Use 'password' field instead of 'hashedPass'
      otp: null,
    });

    // Generate JWT token
    const token = await JsonToken(user._id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      jwt: token,
    });

    next();
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
