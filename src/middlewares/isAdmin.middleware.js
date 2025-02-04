import User from "../models/user.module";
import ApiError from "../utilis/ApiError";

export async function isAdmin(req, res, next) {
    const { id } = req.user;
    if (!id) {
      return res.status(400).json(new ApiError(400, "User ID is missing"));
    }
  
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json(new ApiError(404, `User not found with ID ${id}`));
    }
  
    if (user.role !== "admin") {
      return res.status(403).json(new ApiError(403, "You are not authorized to access this route"));
    }
  
    next();
  }
  