import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { addItem, editItem, getMyItems } from '../controller/items.controller.js';
import upload from '../middlewares/multer.js';
import { deleteItem } from '../controller/items.controller.js';
const itemRouter = express.Router();

// 1. Add Item (Sahi hai)
itemRouter.post('/add-item', isAuth, upload.single("image"), addItem);

// 2. Edit Item (FIXED: :itemId add kiya gaya hai)
// Iske bina req.params.itemId hamesha undefined rahega
itemRouter.post('/edit-item/:itemId', isAuth, upload.single("image"), editItem);

// 3. Get All My Items (FIXED: Name change kiya aur GET method banaya)
// Dashboard isi URL ko hit karega
itemRouter.get('/get-my-items', isAuth, getMyItems);



// routes/item.route.js
itemRouter.delete("/delete-item/:itemId", isAuth, deleteItem);

export default itemRouter;