import { userValidateSchema } from "../../Schema.js"
import ApiError from "../utilis/ApiError.js"
import User from "../models/user.module.js"
import ApiResponse from "../utilis/ApiRespone.js"
import generateAccessToken from "../utilis/generateAccessToken.js";

// Cookie options for the authentication token
const cookieOptions = {
   httpOnly: true,
   secure: false, // In production, this should be set to true for HTTPS
   maxAge: 3600000, // 1 hour expiration
   sameSite: 'Lax', // Restrict cross-site cookie usage
}

// Signup user route
export async function signupUser(req, res) {
   const { username, email, password } = req.body;
   
   // Validate user input
   const { error } = userValidateSchema.validate(req.body);
   if (error) {
      const errMsg = error.details.map(err => err.message).join(', ')
      return res.status(400).json(new ApiError(400, errMsg));
   }
   
   // Check if the email is already registered
   const isValidEmail = await User.findOne({ email });
   if (isValidEmail) return res.status(400).json(new ApiError(400, "email already registered"));

   // Create a new user
   const user = await User.create({
      username,
      email,
      password
   });

   // Generate access token for the user
   const token = generateAccessToken(user.id);

   // Exclude password from the response
   user.password = undefined;

   // Set the token in a secure cookie
   res.cookie("accessToken", token, cookieOptions);
   res.status(201).json(new ApiResponse(201, user, "user signup successfully"));
}

// Login user route
export async function loginUser(req, res) {
   const { email, password } = req.body;
   
   // Validate email and password
   if (!email || !password) return res.status(401).json(new ApiError(401, "username and password are required"));
   
   // Find the user by email
   const user = await User.findOne({ email });
   if (!user) return res.status(400).json(new ApiError(400, "email does not exist"));
   
   // Validate the user's password
   const isValidPassword = await user.isCorrectPassword(password);
   if (!isValidPassword) return res.status(400).json(new ApiError(400, "Password is not valid"));

   // Generate access token for the user
   const token = generateAccessToken(user.id);

   // Set the token in a secure cookie
   res.cookie("accessToken", token, cookieOptions);

   // Exclude password from the response
   user.password = undefined;

   res.status(200).json(new ApiResponse(200, user, "user login successfully"));
}

// Logout user route
export async function logoutUser(req, res) {
   const { id } = req.user;

   // Find the user by ID
   const user = await User.findById(id);
   if (!user) return res.status(400).json(400, "User does not exist");

   // Clear the authentication cookie
   res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "Strict",  
   });

   res.status(200).json(new ApiResponse(200, user, "user logout successfully"));
}

// Get user details route (secured)
export async function getUserDetails(req, res) {
   const user = req.user;

   // Fetch user details along with related orders, addresses, and cart
   const userDetails = await User.aggregate([
      {
         $match: {
            email: user.email
         }
      },
      {
         $lookup: {
            from: "orders", // Lookup orders collection
            localField: "_id",
            foreignField: "owner",
            as: "orders"
         }
      },
      {
         $lookup: {
            from: "addresses", // Lookup addresses collection
            localField: "_id",
            foreignField: "user",
            as: "addresses"
         }
      },
      {
         $lookup: {
            from: "carts", // Lookup carts collection
            localField: "_id",
            foreignField: "owner",
            as: "cartDetails"
         }
      },
   ]);

   // If no user details are found
   if (!userDetails || userDetails.length == 0) return res.status(404).json(new ApiError(404, "user details not found"));

   // Exclude password from the user details
   userDetails[0].password = undefined;

   return res.status(200).json(new ApiResponse(200, userDetails, "success"));
}

// Update user details (role update) route (secured, admin access)
export async function updateUserDetails(req, res) {
   const user = req.user;

   // If no user found
   if (!user) return res.status(404).json(new ApiError(404, "user not found"));

   const { role } = req.body;
   
   // Validate role
   if (!role) return res.status(400).json(new ApiError(400, "please provide a valid role"));

   // Update the user's role
   user.role = role;

   // Save the updated user
   await user.save();

   res.status(201).json(new ApiResponse(201, null, "user role is changed"));
}
