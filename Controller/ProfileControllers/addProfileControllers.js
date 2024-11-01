const multer = require("multer");
const uploadImageByUrl = require("../../Util/ImageUploader.js");
const Profile = require("../../Model/Profile.js");
const User = require("../../Model/User.js");

const storage = multer.memoryStorage();
module.exports.upload = multer({ storage: storage });

module.exports.AddProfileController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { phone, monthlyIncome, budgetGoal, address, dob, gender } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }

    if (!phone || !monthlyIncome || !budgetGoal || !address || !dob) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existUser = await User.findOne({ _id: userId });

    if (!existUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userName = existUser.username;
    const email = existUser.email;

    const dateOfBirth = new Date(dob);
    if (isNaN(dateOfBirth.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format for date of birth",
      });
    }

    const createProfile = await Profile.create({
      userId: userId,
      name: userName,
      email: email,
      phone: phone,
      gender: gender,
      monthlyIncome: monthlyIncome,
      budgetGoal: budgetGoal,
      address: address,
      dob: dateOfBirth.toISOString().split("T")[0],
    });

    if (createProfile) {
      return res.status(201).json({
        success: true,
        message: "Profile added successfully",
        profile: { ...createProfile._doc },
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to create profile",
      });
    }
  } catch (error) {
    console.error("Error in AddProfileController:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
