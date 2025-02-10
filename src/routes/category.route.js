import express from "express";
import WrapAsync from "../utilis/WrapAsync.js";
import { addNewCategory,getAllCategories } from "../controllers/category.controller.js";
const router = express.Router();

router.route("/new").post(WrapAsync(addNewCategory))
// router.route("/:categoryId").get(WrapAsync(getCategories))
router.route("").get(WrapAsync(getAllCategories))
export default router;