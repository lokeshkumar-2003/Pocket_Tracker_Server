const multer = require("multer");
const uploadImageByUrl = require("../../Util/ImageUploader.js");
const Profile = require("../../Model/Profile.js");

const storage = multer.memoryStorage();
module.exports.uploadImage = multer({ storage: storage });

module.exports.UpdateProfileController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { phone, monthlyIncome, budgetGoal, address, dob, gender } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }

    if (
      !phone ||
      !monthlyIncome ||
      !budgetGoal ||
      !address ||
      !dob ||
      !gender
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existProfile = await Profile.findOne({ userId });

    if (!existProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    existProfile.phone = phone;
    existProfile.monthlyIncome = monthlyIncome;
    existProfile.budgetGoal = budgetGoal;
    existProfile.address = address;
    existProfile.gender = gender;

    const dateOfBirth = new Date(dob);
    if (isNaN(dateOfBirth.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format for date of birth",
      });
    }
    existProfile.dob = dateOfBirth.toISOString().split("T")[0];

    const updatedProfile = await existProfile.save();

    if (updatedProfile) {
      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        profile: {
          phone: updatedProfile.phone,
          monthlyIncome: updatedProfile.monthlyIncome,
          budgetGoal: updatedProfile.budgetGoal,
          address: updatedProfile.address,
          dob: updatedProfile.dob,
          gender: updatedProfile.gender,
        },
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to update profile",
      });
    }
  } catch (error) {
    console.error("Error in UpdateProfileController:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
