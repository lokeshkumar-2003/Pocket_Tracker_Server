const Profile = require("../../Model/Profile.js");

const GetProfileControllers = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      message: "User ID is required",
      success: false,
    });
  }

  try {
    const existProfile = await Profile.findOne({ userId });

    if (!existProfile) {
      return res.status(404).json({
        message: "Profile not found",
        success: false,
      });
    }

    return res.status(200).json({
      profile: existProfile,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);

    return res.status(500).json({
      message: "Failed to get the profile",
      success: false,
    });
  }
};

module.exports = GetProfileControllers;
