import express from "express";
import isAuthenticate from "../middlewares/auth.middleware.js"; // Middleware to authenticate the user
import { addToCart, deleteItemFromCart, getCartDetails, updateQuantity } from "../controllers/cart.controller.js"; // Import the cart controller functions
import WrapAsync from "../utilis/WrapAsync.js"; // Wrap async functions to handle errors

const router = express.Router();

// Route to get the cart details for the logged-in user
// This route is secured, only authenticated users can access it
router.get("", isAuthenticate, WrapAsync(getCartDetails)); 

// Route to add an item to the cart for the logged-in user
// This route is secured, only authenticated users can add to their cart
router.post("", isAuthenticate, WrapAsync(addToCart)); 

// Route to update the quantity of a product in the cart
// This route is secured, only authenticated users can update the cart
// The productId and cartId are used to identify the specific product in the cart
router.put("/:productId/:cartId", isAuthenticate, WrapAsync(updateQuantity)); 

// Route to delete an item from the cart for the logged-in user
// This route is secured, only authenticated users can remove an item from their cart
// The productId and cartId are used to identify the specific item to delete
router.delete("/:productId/:cartId", isAuthenticate, WrapAsync(deleteItemFromCart));

export default router;
