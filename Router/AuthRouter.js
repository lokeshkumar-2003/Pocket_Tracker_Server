const router = require("express").Router();
const { Login } = require("../Controller/AuthControllers/Login.js");
const { Signup } = require("../Controller/AuthControllers/Signup.js");
const { UserSession } = require("../Controller/AuthControllers/UserSession.js");
const {
  UserVerification,
  OtpVerification,
  ResetPassword,
} = require("../Controller/AuthControllers/ResetPassword.js");

router.post("/auth/signup", Signup);
router.post("/auth/login", Login);
router.post("/auth/usersession", UserSession);
router.post("/auth/user-verify", UserVerification);
router.post("/auth/otp-verify", OtpVerification);
router.post("/auth/resetPassword", ResetPassword);

module.exports = router;
