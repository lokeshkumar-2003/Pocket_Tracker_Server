const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a MailerBox function using async/await
const MailerBox = async (to, otp) => {
  try {
    // Create a transporter object using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: "Password Reset Request - Pocket Tracker",
      text: `Dear ${to},

We received a request to reset the password for your Pocket Tracker account. To proceed with resetting your password, please use the following One-Time Password (OTP):

Your OTP: ${otp}

This OTP is valid for the next 10 minutes. Please use it to securely reset your password.

If you did not request a password reset, please ignore this email or contact our support team immediately for assistance.

Best regards,
The Pocket Tracker Team`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.response);

    return {
      success: true,
      message: info.response,
    };
  } catch (error) {
    console.error("❌ Error:", error.message);

    return {
      success: false,
      message: error.message,
    };
  }
};

module.exports = MailerBox;
