import Shop from "../models/shop.models.js"; // Shop model import zaroori hai
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createEditShop = async (req, res) => { 
    try {
        const { name, city, state, address } = req.body;
        let image;
        
        if (req.file) {
            const cloudinaryRes = await uploadOnCloudinary(req.file.path);
            image = cloudinaryRes.secure_url; // Cloudinary se URL nikaalein
        }

        // 1. Pehle check karein ki shop pehle se hai ya nahi
        let shop = await Shop.findOne({ owner: req.user._id });

        if (!shop) {
            // 2. Agar nahi hai toh create karein
            shop = await Shop.create({
                name,
                city,
                state,
                address,
                ImageUrl: image,
                owner: req.user._id
            });
        } else { 
            // 3. Agar hai toh update karein
            shop = await Shop.findByIdAndUpdate(
                shop._id, 
                {
                    name,
                    city,
                    state,
                    address,
                    ...(image && { ImageUrl: image }) // Agar nayi image hai tabhi update karein
                },
                { new: true }
            );
        }
       
        await shop.populate('owner');
        return res.status(201).json({ 
            success: true, 
            message: "Shop processed successfully", 
            shop 
        });
     
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error creating/updating shop", error: error.message });
    }
}

export const getShopById = async (req, res) => { 
    try {
        // req.user._id isAuth middleware se aa raha hai
        const shop = await Shop.findOne({ owner: req.user._id }).populate("owner items");
        
        if (!shop) {
            // Shop nahi hai toh error nahi, success false bhejein taaki frontend handle kar sake
            return res.status(200).json({ success: false, message: "No shop found for this owner" });
        }

        // Shop mil gayi toh success true ke saath bhej dein
        return res.status(200).json({ success: true, shop });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching shop", error: error.message });
    }
};