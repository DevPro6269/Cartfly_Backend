import express from "express";
import WrapAsync from "../utilis/WrapAsync.js";
import { AddProduct, getAllProducts, getProductById, updateProductDetails } from "../controllers/product.controller.js";
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
    
]), WrapAsync(AddProduct))

router.route("/:productId").put(isAdmin,updateProductDetails)
.get(WrapAsync(getProductById))


router.route("").get(WrapAsync(getAllProducts));


export default router;