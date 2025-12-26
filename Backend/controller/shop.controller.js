import Shop from "../models/shop.models.js"; // Shop model import zaroori hai
import uploadOnCloudinary from "../utils/cloudinary.js";

// shop.controller.js (Backend)

export const createEditShop = async (req, res) => {
    try {
        // req.body se ImageUrl bhi nikaalein
        const { name, city, state, address, ImageUrl } = req.body;
        const ownerId = req.user?._id || req.user?.id;

        // 1. Image Logic: Priority req.file ko dein, varna body se ImageUrl lein
        let finalImageUrl = ImageUrl || ""; 

        if (req.file) {
            const cloudinaryRes = await uploadOnCloudinary(req.file.path);
            if (cloudinaryRes) {
                finalImageUrl = cloudinaryRes.secure_url;
            }
        }

        // 2. Existing Shop dhoondein
        let shop = await Shop.findOne({ owner: ownerId });

        if (!shop) {
            // Nayi shop ke liye agar image nahi hai toh error dein
            if (!finalImageUrl) {
                return res.status(400).json({ success: false, message: "Shop image is required" });
            }

            shop = await Shop.create({
                name,
                city,
                state,
                address,
                ImageUrl: finalImageUrl,
                owner: ownerId
            });
        } else {
            // Update logic: Sirf wahi fields update karein jo aaye hain
            const updateFields = {
                name: name || shop.name,
                city: city || shop.city,
                state: state || shop.state,
                address: address || shop.address,
            };

            if (finalImageUrl) {
                updateFields.ImageUrl = finalImageUrl;
            }

            shop = await Shop.findByIdAndUpdate(
                shop._id,
                { $set: updateFields },
                { new: true }
            );
        }

        return res.status(200).json({
            success: true,
            message: "Shop saved successfully!",
            shop
        });

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};




// controller/shop.controller.js

// controller/shop.controller.js

export const getShopById = async (req, res) => { 
    try {
        // req.user check karein (isAuth middleware se aa raha hai)
        // Note: Check karein aapne JWT sign karte waqt 'id' use kiya tha ya '_id'
        const userId = req.user?.id || req.user?._id; 

        if (!userId) {
            return res.status(401).json({ success: false, message: "User ID not found in token" });
        }

        // Shop dhoondein (Bina populate ke pehle check karein)
        const shop = await Shop.findOne({ owner: userId });
        
        if (!shop) {
            return res.status(200).json({ success: false, message: "No shop found" });
        }

        // Agar shop mil gayi
        return res.status(200).json({ 
            success: true, 
            shop 
        });

    } catch (error) {
        console.error("GET SHOP ERROR:", error.message);
        // Server Error tab aata hai jab code crash hota hai
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};