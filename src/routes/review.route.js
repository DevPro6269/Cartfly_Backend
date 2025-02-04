import express from "express";
import WrapAsync from "../utilis/WrapAsync.js"
import isAuthenicate from "../middlewares/auth.middleware.js";
import { showAllReviews, CreateNewReview } from "../controllers/review.controller.js";
const router = express.Router()

router.route("/:productId").get(WrapAsync(showAllReviews))
router.route("/new/:productId").post( isAuthenicate,WrapAsync(CreateNewReview))