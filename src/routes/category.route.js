import express from "express";
import WrapAsync from "../utilis/WrapAsync.js";
import { addNewCategory } from "../controllers/category.controller.js";
const router = express.Router();

router.route("/new").post(WrapAsync(addNewCategory))

export default router;