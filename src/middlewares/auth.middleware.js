import jwt from "jsonwebtoken";
import ApiError from "../utilis/ApiError.js";
import User from "../models/user.module.js";

async function isAuthenticate(req, res, next) {
  const accessToken = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    return res.status(400).json(new ApiError(400, "Invalid token or token not found"));
  }

  try {
   
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    req.user = user;
    
    next();
  } catch (error) {
    return res.status(400).json(new ApiError(400, "Invalid or expired token"));
  }
}

export default isAuthenticate;
