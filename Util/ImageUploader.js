const { v2: cloudinary } = require("cloudinary");
require("dotenv").config();

const uploadImageByUrl = async (fileBuffer) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY_IMG,
    api_secret: process.env.SCRETE_KEY_IMG,
  });

  try {
    const base64String = fileBuffer.toString("base64");

    const dataUri = `data:image/png;base64,${base64String}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "profile_pictures",
    });

    return uploadResult;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

module.exports = uploadImageByUrl;
