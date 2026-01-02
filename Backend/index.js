import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import router from "./routes/auth.routes.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";
import orderRouter from "./routes/order.routes.js";


const app = express();
const PORT = process.env.PORT || 3000;

// cors configuration
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true,
}));

// middlewares
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", router);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order",orderRouter);
// index.js (Routes se theek upar)
// index.js
app.use((req, res, next) => {
    console.log("--- New Request ---");
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    console.log("Headers:", req.headers.origin);
    next();
});



// start server only after DB connection
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server ❌", error.message);
    process.exit(1);
  }
};

startServer();
