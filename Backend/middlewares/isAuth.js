import jwt from 'jsonwebtoken';

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated. Please login again." 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // FIX: Yahan underscore handle karein
    // Agar login mein 'id' bheja tha, toh use '_id' mein map kar dein
    // taaki database queries (req.user._id) har jagah kaam karein.
    req.user = {
      _id: decoded.id || decoded._id, // Dono handle kar liye
      ...decoded
    }; 
    
    console.log("✅ Auth Success for User ID:", req.user._id);
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    const message = error.name === 'TokenExpiredError' 
      ? "Session expired. Please login again." 
      : "Authentication failed. Invalid token.";

    return res.status(401).json({ success: false, message });
  }
};

export default isAuth;