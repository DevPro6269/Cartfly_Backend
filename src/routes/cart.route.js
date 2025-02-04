import express from "express";
import isAuthenticate from "../middlewares/auth.middleware.js";
import { addToCart, deleteItemFromCart, getCartDetails, updateQuantity } from "../controllers/cart.controller.js";

const router = express.Router();


router.get("/", isAuthenticate, getCartDetails); 
router.post("/", isAuthenticate, addToCart); 
router.put("/:cartId", isAuthenticate, updateQuantity); 
router.delete("/:productId", isAuthenticate, deleteItemFromCart);

export default router;
