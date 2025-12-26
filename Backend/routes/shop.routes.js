import express from 'express';
import  isAuth  from '../middlewares/isAuth.js';
import { createEditShop, getShopById } from '../controller/shop.controller.js';
import upload from '../middlewares/multer.js';



const shopRouter = express.Router();

shopRouter.post('/create-edit',isAuth,upload.single("image"),createEditShop);
shopRouter.get("/get-my",isAuth,getShopById)
export default shopRouter;