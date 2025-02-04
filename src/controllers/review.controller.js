import ApiRespone from "../utilis/ApiRespone.js";
import ApiError from "../utilis/ApiError.js";
import Review from "../models/review.model.js";
import User from "../models/user.module.js";
import Product from "../models/prodcuts.module.js";
import { json } from "express";

export async function showAllReviews(req, res) {
  const { productId } = req.params;
  if (!productId)
    return res
      .status(400)
      .json(new ApiError(400, "please provide product id "));

  const reviews = await Review.find({ product: productId });

  if (reviews.length == 0)
    return res.status(404).json(new ApiError(404, "reviews not found"));

  res.status(200).json(new ApiRespone(200, reviews, "success"));
}

export async function CreateNewReview(req, res) {
  const { id } = req.user;
  if (!id)
    return res.status(400).json(new ApiError(400, "user not Authenticate"));

  const user = await User.findById(id);
  if (!user)
    return res.status(400).json(new ApiError(400, "user does not exist"));

  const { productId } = req.params;
  if (!productId)
    return res
      .status(400)
      .json(new ApiError(400, "please provide a valid product id"));

  const product = await Product.findById(productId);
  if (!product)
    return res.status(400).json(new ApiRespone(400, "product does not exist"));

  const isReviewExist = await Review.findOne({ owner: id, product: productId });
  if (isReviewExist)
    return res
      .status(400)
      .json(new ApiError(400), "review already exists with this user id ");

  const { rating, message } = req.body;
  if (!message)
    return res
      .status(400)
      .json(new ApiError(400, "plese provide a valid message"));

  if (rating) {
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json(new ApiError(400, "Rating must be a number between 1 and 5"));
    }
  }

  const review = await Review.create({
    owner: id,
    product: productId,
    rating,
    message,
  });

  if (!review)
    return res.status(500).json(new ApiError(500, "internal server error"));

  res
    .status(201)
    .json(new ApiRespone(201, review, "review create successfully"));
}

export async function deleteReview(req, res) {
  const { id } = req.user;
  const { reviewId } = req.params;
  if (!id) return res.status(400).json(new ApiError(400, "user id is missing"));
  if (!reviewId)
    return res.status(400).json(new ApiError(400, "review id is missing"));

  const user = await User.findById(id);
  if (!user) return res.status(404).json(new ApiError(404, "user not found"));

  const review = await Review.findById(reviewId);
  if (!review)
    return res.status(404).json(new ApiError(404, "review not found"));

  if (review.owner.toString() !== id) {
    return res
      .status(403)
      .json(new ApiError(403, "You are not authorized to perform this action"));
  }

  const product = await Product.findOne({ reviews: reviewId });

  if (!product)
    return res
      .status(404)
      .json(new ApiRespone(404, "product with this review not found"));

  const filteredReviews = product.reviews.filter(
    (r) => r.toString() !== reviewId
  );
  product.reviews = filteredReviews;

  await product.save();

  const deleteStatus = Review.findByIdAndDelete(reviewId);
  if (!deleteStatus)
    return res.status(500).json(new ApiError(500, "internal server error"));

  res.status(200).json(200, null, "review deleted successfully");
}
