const jwt = require("jsonwebtoken");
const User = require("../../Model/User.js");
require("dotenv").config();

module.exports.UserSession = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token must be provided",
    });
  }

  try {
    const decoded = await jwt.verify(token, process.env.SALT);

    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Unauthorized access, user not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: {
        userId: user._id,
        name: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("JWT verification error:", err);

    return res.status(400).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
