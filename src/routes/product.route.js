import express from "express";
import WrapAsync from "../utilis/WrapAsync.js";
import { AddProduct } from "../controllers/product.controller.js";
import upload from "../middlewares/multer.middleware.js"
const router = express.Router();


router.route("/new").post( upload.fields([
    {
        name: "media",
        maxCount: 6,
    },
    {
        name: "thumbnail",
        maxCount: 1,
    },
    
]),  WrapAsync(AddProduct))



export default router;