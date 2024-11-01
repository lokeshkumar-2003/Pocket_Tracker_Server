const User = require("../../Model/User.js");
const validator = require("validator");
const randomatic = require("randomatic");
const MailerBox = require("./Email/Mailer.js");
const bcrypt = require("bcrypt");
const { hashPassword } = require("../../Util/Auth.js");
require("dotenv").config();

const UserVerification = async (req, res) => {
  try {
    const { toEmail } = req.body;

    if (!toEmail) {
      return res.status(400).json({
        success: false,
        message: "Email ID required.",
      });
    }

    if (!validator.isEmail(toEmail)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email." });
    }

    const user = await User.findOne({ email: toEmail });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const generatedOtp = randomatic("0", 6);
    user.otp = generatedOtp;

    await user.save();

    const mailerResponse = await MailerBox(toEmail, generatedOtp);
    const { success } = mailerResponse;

    if (success) {
      return res.status(200).json({
        success: true,
        message: "OTP has been sent to your email.",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Error sending OTP.",
      });
    }
  } catch (error) {
    console.error("Error in UserVerification:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error." });
  }
};

const OtpVerification = async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({
      success: false,
      message: "OTP are required.",
    });
  }

  const user = await User.findOne({ otp });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP.",
    });
  } else {
    user.otp = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });
  }
};

const ResetPassword = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Both password and confirm password are required.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password should match",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.password = await hashPassword(password);

    await user.save(); // Wait for the save to complete

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Error in ResetPassword:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error." });
  }
};

module.exports = {
  UserVerification,
  OtpVerification,
  ResetPassword,
};
