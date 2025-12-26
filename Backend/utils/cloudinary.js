import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
// Config ko function ke bahar rakhein
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
    try {
        if (!filePath) return null;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto"
        });

        // 🟢 Pura result object return karein taaki controller mein .secure_url mil sake
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); 
        }
        return result; 

    } catch (error) {
        // 🔴 Error aane par file delete karein taaki server space na bhare
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        console.error('Cloudinary Upload Error:', error);
        return null; // Throw karne ki jagah null return karein taaki controller handle kar sake
    }
};

export default uploadOnCloudinary;