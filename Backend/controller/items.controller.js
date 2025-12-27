import Shop from "../models/shop.models.js";
import uploadOnCloudinary  from "../utils/cloudinary.js";
import Item from "../models/item.models.js"; // 👈 Yeh line missing ho sakti hai
export const addItem = async (req, res) => {
    console.log("Reached AddItem Controller! ✅");
    
    try {
        const { name, category, foodType, price } = req.body;
        let imageUrl = ""; // Variable ka naam thoda clear rakhte hain
        
        if(req.file){
            const result = await uploadOnCloudinary(req.file.path);
            // FIX: Pura object nahi, sirf uska secure_url string nikalna hai
            if (result && result.secure_url) {
                imageUrl = result.secure_url;
            }
        }

        const userId = req.user.id || req.user._id; 
        console.log("Searching shop for User ID:", userId);

        const shop = await Shop.findOne({ owner: userId });

        if(!shop){
            console.log("❌ Shop nahi mili!");
            return res.status(404).json({ 
                success: false, 
                message: "Shop not found for this user." 
            });
        }

        const item = await Item.create({
            name,
            category,
            foodType,
            price,
            image: imageUrl, // ✅ Ab yahan sirf URL string jayegi
            shop: shop._id
        });

        console.log("✅ Item created successfully!");
        return res.status(201).json({ success: true, message: "Item added", item });

    } catch (error) {
        console.log("Error logic mein hai:", error.message);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const editItem=async(req,res) =>{
    try {
        const itemId=req.params.itemId
        const {name,category,foodType,price}=req.body;
        let image;
        if(req.file){
            image = await uploadOnCloudinary(req.file.path);
        }
        const item = await Item.findByIdAndUpdate(itemId,{
            name,category,foodType,price,image},
            { new:true
        })
        if(!item){
            return  res.status(400).json({message:"Item not found", item});
        }
        return res.status(201).json({message:"Item added successfully", item});
    } catch (error) {
        return res.status(500).json({message:"add item error"},error);
    }
}