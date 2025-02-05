import express from "express";
import WrapAsync from "../utilis/WrapAsync.js";
import { AddProduct, updateProductDetails } from "../controllers/product.controller.js";
import upload from "../middlewares/multer.middleware.js"
import {isAdmin} from "../middlewares/isAdmin.middleware.js"
const router = express.Router();




// secured routes
router.route("/new").post( upload.fields([
    {
        name: "media",
        maxCount: 6,
    },
    {
        name: "thumbnail",
        maxCount: 1,
    },
    
]), isAdmin, WrapAsync(AddProduct))

router.route("/:productId").put(isAdmin,updateProductDetails)


export default router;