import express from "express";
import WrapAsync from "../utilis/WrapAsync.js";
import { addSubCategory, getSubCategories } from "../controllers/subCategory.controller.js";

const router = express.Router();

router.route("/new/:categoryId").post(WrapAsync(addSubCategory));
router.route("/:category").get(WrapAsync(getSubCategories))
export default router;