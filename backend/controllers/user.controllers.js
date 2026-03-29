const User = require('../models/user.model');
const { uploadOnCloudinary } = require('../config/cloudinary');

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Get Current User Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const editProfile = async (req, res) => {
    try {
        const { name } = req.body;
        let imageUrl;

        // Check if file exists and upload to Cloudinary
        if (req.file) {
            // console.log("File received:", req.file.path); // Debug log
            imageUrl = await uploadOnCloudinary(req.file.path);
            
            if (!imageUrl) {
                return res.status(500).json({ 
                    message: "Failed to upload image to Cloudinary" 
                });
            }
            // console.log("Image uploaded to Cloudinary:", imageUrl); // Debug log
        }

        // Prepare update object
        const updateData = {};
        if (name) updateData.name = name;
        if (imageUrl) updateData.image = imageUrl;

        // Update user in database
        const user = await User.findByIdAndUpdate(
            req.userId, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // console.log("User updated successfully:", user); // Debug log
        res.status(200).json(user);

    } catch (error) {
        console.error("Edit Profile Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getOtherUsers = async(req,res)=>{
    try {
        // Exclude the current user from the results
        let users = await User.find({_id : { $ne : req.userId }}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error("Get Other Users Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { getCurrentUser, editProfile, getOtherUsers };