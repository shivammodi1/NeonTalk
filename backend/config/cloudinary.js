const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// configure once
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "chat-app-profiles", 
    });

    // delete local file safely
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return uploadResult.secure_url;

  } catch (error) {

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};

module.exports = { uploadOnCloudinary };
