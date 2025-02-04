import express from "express";
import WrapAsync from "../utilis/WrapAsync.js";
import isAuthenicate from "../middlewares/auth.middleware.js";
import {
  showAllReviews,
  CreateNewReview,
  deleteReview,
} from "../controllers/review.controller.js";
const router = express.Router();

router.route("/:productId").get(WrapAsync(showAllReviews));
router.route("/new/:productId").post(isAuthenicate, WrapAsync(CreateNewReview));
router.route("/:reviewId").delete(isAuthenicate, deleteReview);

export default router;
