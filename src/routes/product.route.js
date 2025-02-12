import express from "express";
import WrapAsync from "../utilis/WrapAsync.js"; // Utility to wrap async functions to handle errors
import { 
  AddProduct, 
  DeleteProducts, 
  getAllProducts, 
  getProductById, 
  updateProductDetails 
} from "../controllers/product.controller.js"; // Importing the controller functions
import upload from "../middlewares/multer.middleware.js"; // Middleware for handling file uploads
import { isAdmin } from "../middlewares/isAdmin.middleware.js"; // Middleware for admin authentication

const router = express.Router();

// Route for adding a new product (requires file upload for media and thumbnail)
router.route("/new").post(
  // Upload middleware for handling media (up to 6 files) and a single thumbnail
  upload.fields([
    {
      name: "media",
      maxCount: 6,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]), 
  // Wrap async AddProduct function to handle async errors
  WrapAsync(AddProduct)
);

// Route for managing products (update, get, delete) by productId
router.route("/:productId")
  // Update product details (PUT request)
  .put(WrapAsync(updateProductDetails))
  // Get product details by productId (GET request)
  .get(WrapAsync(getProductById))
  // Delete product by productId (DELETE request)
  .delete(WrapAsync(DeleteProducts));

// Route for getting all products (GET request)
router.route("").get(WrapAsync(getAllProducts));

export default router;
