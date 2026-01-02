import Shop from "../models/shop.models.js";
import Order from "../models/order.model.js";
import User from "../models/user.models.js"; // Ensure file name is correct

export const placeOrder = async (req, res) => {
    try {
        const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        const groupItemsByShop = {};
        cartItems.forEach(item => {
            const shopId = item.shop;
            if (!groupItemsByShop[shopId]) groupItemsByShop[shopId] = [];
            groupItemsByShop[shopId].push(item);
        });

        const shopOrders = await Promise.all(Object.keys(groupItemsByShop).map(async (shopId) => {
            const shop = await Shop.findById(shopId);
            if (!shop) throw new Error(`Shop with ID ${shopId} not found`);

            const items = groupItemsByShop[shopId];
            const subtotal = items.reduce((sum, i) => sum + (Number(i.price) * Number(i.quantity)), 0);

            return {
                shop: shop._id,
                owner: shop.owner,
                subtotal,
                shopOrderItems: items.map((i) => ({
                    item: i.id || i._id,
                    price: i.price,
                    quantity: i.quantity,
                    name: i.name
                }))
            };
        }));

        const newOrder = await Order.create({
            user: req.user?._id || req.userId,
            paymentMethod,
            deliveryAddress,
            totalAmount,
            shopOrders
        });
   await newOrder.populate("shopOrders.shopOrderItems.item","name image price")
   await newOrder.populate("shopOrders.shop","name")
        return res.status(201).json({ success: true, order: newOrder });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const authUserId = req.user?._id || req.userId;
        const user = await User.findById(authUserId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // --- CUSTOMER ROLE ---
        if (user.role === "user") {
            const orders = await Order.find({ user: authUserId })
                .sort({ createdAt: -1 })
                .populate("shopOrders.shop", "name")
                .populate("shopOrders.shopOrderItems.item", "name image price");

            return res.status(200).json({ success: true, orders });
        }

        // --- OWNER ROLE ---
        else if (user.role === "owner") {
            const orders = await Order.find({ "shopOrders.owner": authUserId })
                .sort({ createdAt: -1 })
                .populate("user", "Fullname email mobile")
                .populate("shopOrders.shop", "name")
                .populate("shopOrders.shopOrderItems.item", "name image price");

            // Data Transformation: Owner ko sirf apni shop ka data dikhe
            const filteredOrders = orders.map(order => {
                const orderObj = order.toObject();
                // Humne .filter use kiya taaki shopOrders hamesha ek array rahe
                orderObj.shopOrders = orderObj.shopOrders.filter(
                    (so) => so.owner.toString() === authUserId.toString()
                );
                return orderObj;
            });

            // FIX: Key name 'orders' hi rakha hai taaki frontend hook sahi se chale
            return res.status(200).json({ success: true, orders: filteredOrders });
        }

    } catch (error) {
        console.error("GET ORDERS ERROR ❌:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// order.controller.js
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body; // Example: "Accepted", "Preparing", "Delivered"

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        ).populate("user", "Fullname mobile");

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        return res.status(200).json({ 
            success: true, 
            message: `Order marked as ${status}`, 
            order: updatedOrder 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};