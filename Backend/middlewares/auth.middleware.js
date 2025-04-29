import jwt from "jsonwebtoken";
import User from '../models/User.model.js';

export const verifyJWT = async (req, res, next) => {
  try {
    // ✅ Extract token from cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      (req.header("Authorization")?.startsWith("Bearer ") &&
        req.header("Authorization").split(" ")[1]);

    // ✅ Check if token exists
    if (!token) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    // ✅ Verify JWT token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // ✅ Fetch user details without password or refreshToken
    const user = await User.findById(decodedToken._id).select("-password -refreshToken");

    // ✅ Check if user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid Access Token" });
    }

    // ✅ Attach user to request object and proceed
    req.user = user;
    next();
  } catch (error) {
    // console.error("Error verifying JWT:", error.message);

    // ✅ Handle invalid or expired tokens separately
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};



