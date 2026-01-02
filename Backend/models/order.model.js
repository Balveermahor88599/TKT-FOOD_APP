import mongoose from "mongoose";

const shopOrderItemSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    },
    name: String,
    price: Number,
    quantity: Number
}, { timestamps: true }); // Fixed spelling

const shopOrderSchema = new mongoose.Schema({
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop"
    },
    owner: { // Fixed: Capital 'O' to small 'o'
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    subtotal: Number, // Fixed: Capital 'T' to small 't' to match controller
    shopOrderItems: [shopOrderItemSchema],

}, { timestamps: true });

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    paymentMethod: {
        type: String,
        enum: ["cod", "online"],
        required: true
    },
    deliveryAddress: {
        text: String,
        latitude: Number,
        longitude: Number
    },
    totalAmount: {
        type: Number
    },
    shopOrders: [shopOrderSchema],
    status:{
        type:String,
        enum:["pending","preparing","out of delivery","delivered"],
        default:"pending"
    }
}, { timestamps: true }); // Fixed: plural 'timestamps'

const Order = mongoose.model("Order", orderSchema);
export default Order;