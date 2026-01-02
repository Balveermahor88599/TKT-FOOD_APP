import express from 'express';
import isAuth from '../middlewares/isAuth.js';

import { placeOrder, getMyOrders, updateOrderStatus } from '../controller/oder.controller.js';
 
const orderRouter = express.Router();

// Routes
orderRouter.post("/place-order", isAuth, placeOrder);
orderRouter.get("/my-orders", isAuth, getMyOrders);
orderRouter.put("/update-status/:orderId", isAuth, updateOrderStatus);

export default orderRouter;