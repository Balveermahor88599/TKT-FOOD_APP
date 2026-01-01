import mongoose from "mongoose";

const shopOrderItemSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    },
    name:String,
    price: Number,
    quantity: Number
}, { timeStamps: true })

const shopOrderSchema = new mongoose.Schema({
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop"
    },
    Owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    subTotal: Number,
    shopOrderItems: [shopOrderItemSchema],

}, { timeStamps: true })

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
    shopOrders: [shopOrderSchema]
}, { timestamp: true })


const Order = mongoose.model("Order",orderSchema)

export default orderSchema;