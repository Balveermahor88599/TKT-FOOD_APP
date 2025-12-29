import Shop from "../models/shop.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import Item from "../models/item.models.js";

// 1. ADD ITEM (Ye ab sahi hai)
export const addItem = async (req, res) => {
    try {
        const { name, category, foodType, price } = req.body;
        let imageUrl = "";

        if (req.file) {
            const result = await uploadOnCloudinary(req.file.path);
            if (result) imageUrl = result.secure_url;
        }

        const userId = req.user.id || req.user._id;
        const shop = await Shop.findOne({ owner: userId });

        if (!shop) return res.status(404).json({ success: false, message: "Shop not found" });

        const item = await Item.create({
            name, category, foodType, price,
            image: imageUrl,
            shop: shop._id
        });

        return res.status(201).json({ success: true, message: "Item added", item });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 2. EDIT ITEM (FIXED: Image logic aur URL extraction)
export const editItem = async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const { name, category, foodType, price } = req.body;

        // Purana item dhundhein taaki purani image ka URL mil sake
        const existingItem = await Item.findById(itemId);
        if (!existingItem) return res.status(404).json({ message: "Item not found" });

        let imageUrl = existingItem.image; // Default purani image rakhein

        if (req.file) {
            const result = await uploadOnCloudinary(req.file.path);
            if (result) imageUrl = result.secure_url; // Nayi image milne par update karein
        }

        const item = await Item.findByIdAndUpdate(itemId, {
            name, category, foodType, price,
            image: imageUrl // ✅ Pura object nahi, sirf string URL
        }, { new: true });

        return res.status(200).json({ success: true, message: "Item updated successfully", item });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyItems = async (req, res) => {
    try {
        // Step 1: Check karein req.user hai ya nahi (Authentication check)
        if (!req.user) {
            console.log("❌ Controller Error: req.user is undefined. check isAuth middleware.");
            return res.status(401).json({ success: false, message: "Unauthorized: User not found in request" });
        }

        // Step 2: ID nikalna (isAuth mein humne _id aur id dono handle kiye hain)
        const userId = req.user._id;
        console.log("🔍 Fetching Shop for User ID:", userId);

        // Step 3: Shop dhundna
        const shop = await Shop.findOne({ owner: userId });

        if (!shop) {
            console.log("❌ Database Error: No Shop linked with User ID:", userId);
            // Agar shop nahi milti toh empty array bhej dena better hai bajaye 404 ke
            return res.status(200).json({ success: true, items: [], message: "No shop found" });
        }

        // Step 4: Items dhundna
        const items = await Item.find({ shop: shop._id });
        console.log(`✅ Success: Found ${items.length} items for shop: ${shop.name}`);

        return res.status(200).json({ success: true, items });

    } catch (error) {
        console.error("❌ getMyItems Catch Error:", error.message);
        return res.status(500).json({ success: false, message: "Server error while fetching items" });
    }
};



// controllers/item.controller.js
export const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.itemId;

        // 1. Item ko delete karein
        const deletedItem = await Item.findByIdAndDelete(itemId);

        if (!deletedItem) {
            return res.status(404).json({
                success: false,
                message: "Item nahi mila"
            });
        }

        // 2. Success response bhejye
        return res.status(200).json({
            success: true,
            message: "Item delete ho gaya"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const getItemByCity = async (req, res) => {
    try {
        const { city } = req.params
        if (!city) {
            return res.status(400).json({ message: "city is required" })
        }
        const shops = await Shop.find({
            city: { $regex: new RegExp(`^${city}$`, "i") }
        }).populate('items')
        if (!shops) {
            return res.status(400).json({ message: "shops not found" })
        }
        const shopIds=shops.map((shop)=>shop._id)
        const items=await Item.find({shop:{$in:shopIds}})
        return res.status(200).json(items)
    } catch (error) {
      console.error("❌ getItemByCity Catch Error:", error.message);
    }
}