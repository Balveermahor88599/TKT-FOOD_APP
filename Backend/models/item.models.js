import mongoose from 'mongoose';

const itemSchma = new mongoose.Schema({
    name: { type: String, required: true },
    // required: true hata diya taaki frontend se na bhejne par error na aaye
    description: { type: String }, 
    category: { 
        type: String,
        enum: ['Snacks','Main Course', 'Beverages', 'Desserts','Pizza','Burgers','Sanwiches','South Indian','North Indian','Chinese','Italian','Mexican','others'], 
        required: true 
    },
    price: { 
        type: Number,
        min: 0, 
        required: true 
    },
    foodType: { 
        type: String,
        enum: ['Veg', 'Non-Veg'], 
        required: true 
    },
    // required: true hata diya kyunki Cloudinary timeout kar raha hai
    image: { type: String }, 

    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true }
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchma);

export default Item;