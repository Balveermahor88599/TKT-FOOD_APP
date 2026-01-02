// 1. Add this import (check your actual file path/name for the User model) 
import User from "../models/user.models.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized access: No valid user ID in token" 
      });
    }

    // 2. Now "User" will be defined here
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found in database" 
      });
    }

    return res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    // This is where you were seeing the "User is not defined" log
    console.error("Get Current User Error:", error.message); 
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

export const updateUserLocation = async (req, res) => {
  try {
    const { lat, lon } = req.body;

    // Validation: Check if coordinates are provided
    if (lat === undefined || lon === undefined) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        location: {
          type: "Point",
          // IMPORTANT: MongoDB GeoJSON coordinates [longitude, latitude] order follow karta hai
          coordinates: [parseFloat(lon), parseFloat(lat)],
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // FIXED: Pehle status 400 tha, use 200 karein success ke liye
    return res.status(200).json({
      success: true,
      message: "Location updated successfully",
      location: user.location,
    });
  } catch (error) {
    console.error("Update Location User Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};