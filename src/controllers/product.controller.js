import { productValidateSchema } from "../../Schema.js"; // Importing product validation schema
import Product from "../models/prodcuts.module.js"; // Importing Product model
import ApiError from "../utilis/ApiError.js"; // Importing custom error class
import ApiRespone from "../utilis/ApiRespone.js"; // Importing custom response class
import { uploadOnCloudinary } from "../utilis/cloudnary.js"; // Importing Cloudinary upload utility
import Category from "../models/category.model.js"; // Importing Category model
import SubCategory from "../models/subCategory.model.js"; // Importing SubCategory model

// Function to add a new product
export async function AddProduct(req, res) {
  // Validate the product data using Joi schema
  const { error } = productValidateSchema.validate(req.body);
  
  // If validation fails, return error response
  if (error)
    return res
      .status(400)
      .json(new ApiError(400, error.details.map((e) => e.message).join(" ")));

  // Handle file upload for the thumbnail image
  const thumbnailFile = req.files?.thumbnail ? req.files.thumbnail[0] : null;
  if (!thumbnailFile)
    return res
      .status(400)
      .json(new ApiError(400, "please provide valid thumbnail"));

  // Upload the thumbnail image to Cloudinary
  let result = await uploadOnCloudinary(req.files?.thumbnail[0].path);
  const thumbnailUrl = result?.url;

  // If thumbnail upload fails, return error response
  if (!thumbnailUrl) {
    return res
      .status(400)
      .json(new ApiError(400, "Failed to upload thumbnail image"));
  }

  // Handle upload of product media images
  const productImages = req.files?.productImages ? req.files.productImages : [];
  let mediaUrls = [];

  // Upload each product image to Cloudinary and collect the URLs
  for (const image of productImages) {
    try {
      const imageResult = await uploadOnCloudinary(image.path);
      mediaUrls.push(imageResult.url);
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiError(500, "Error uploading product images to Cloudinary")
        );
    }
  }

  // Extract product information from the request body
  const {
    title,
    description,
    price,
    discount,
    Availability,
    returnPolicyDays,
    tags,
    brandName,
    deliveryCharge,
    colors,
    stock,
    subCategory,
    category
  } = req.body;

  // Check if the provided category exists
  const validCategory = await Category.findOne({ category });
  if(!validCategory) return res.status(404).json(new ApiError(404,"category does not exist"));

  // Check if the provided sub-category exists
  const validSubCategory = await SubCategory.findOne({ subCategory });
  if(!validSubCategory) return res.status(404).json(new ApiError(404,"sub-category does not exist"));

  // Create the new product with provided details
  const product = await Product.create({
    title,
    description,
    price,
    discount,
    Availability,
    returnPolicyDays,
    media: mediaUrls,
    tags,
    brandName,
    deliveryCharge,
    colors,
    thumbnail: thumbnailUrl,
    stock,
    category: validCategory.id,
    subCategory: validSubCategory.id
  });

  // If product creation fails, return error response
  if (!product)
    return res
      .status(400)
      .json(new ApiError(400, "all fields must be required"));

  // Return success response with newly created product
  return res
    .status(201)
    .json(new ApiRespone(201, product, "product successfully created"));
}

// Function to get product details by ID
export async function productDetailsById(req, res) {
  const { productId } = req.params;
  
  // Check if productId is provided in the request params
  if (!productId)
    return res
      .status(400)
      .json(new ApiError(400, "product id is missing in parameters"));

  // Aggregate data related to the product (reviews, category, related products)
  const productDetails = await Product.aggregate([
    { $match: { _id: productId } }, // Match the product by productId
    {
      $lookup: {
        from: "reviews", // Lookup related reviews
        localField: "_id",
        foreignField: "product",
        as: "cutomerReviews",
      },
    },
    {
      $lookup: {
        from: "categories", // Lookup category details
        localField: "category",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    {
      $lookup: {
        from: "products", // Lookup related products based on shared tags
        localField: "tags",
        foreignField: "tags",
        as: "relatedProducts",
      },
    },
    {
      $project: {
        relatedProducts: {
          $slice: ["$relatedProducts", 5], // Only show top 5 related products
        },
      },
    },
  ]);

  // If product details are not found, return error response
  if (productDetails.length == 0)
    return res
      .status(404)
      .json(new ApiError(404, "Products details not found"));

  // Return success response with the product details
  return res.status(200).json(new ApiRespone(200, productDetails, "success"));
}

// Function to update product details (admin only)
export async function updateProductDetails(req, res) {
  const { productId } = req.params;

  // Check if productId is provided in the request params
  if (!productId)
    return res.status(400).json(new ApiError(400, "please provide product id"));

  // Find the product by productId
  const product = await Product.findById(productId);
  if (!product)
    return res
      .status(404)
      .json(new ApiError(404, "Product not found with this id"));

  const updateData = {};

  // Only add fields to updateData if they are present in the request body
  if (req.body.title) updateData.title = req.body.title;
  if (req.body.description) updateData.description = req.body.description;
  if (req.body.price !== undefined) updateData.price = req.body.price;
  if (req.body.discount !== undefined) updateData.discount = req.body.discount;
  if (req.body.Availability !== undefined) updateData.Availability = req.body.Availability;
  if (req.body.stock !== undefined) updateData.stock = req.body.stock;
  if (req.body.brandName) updateData.brandName = req.body.brandName;
  if (req.body.tags) updateData.tags = req.body.tags;
  if (req.body.deliveryCharge !== undefined) updateData.deliveryCharge = req.body.deliveryCharge;
  if (req.body.colors) updateData.colors = req.body.colors;
  if (req.body.returnPolicyDays !== undefined) updateData.returnPolicyDays = req.body.returnPolicyDays;

  // If no valid fields to update, return early
  if (Object.keys(updateData).length === 0)
    return res.status(400).json(new ApiError(400, "No valid fields to update"));

  // Update the product with the new data
  const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });

  // If product update fails, return error response
  if (!updatedProduct) return res.status(500).json(new ApiRespone(500, "internal server error"));

  // Return success response with updated product
  return res.status(201).json(new ApiRespone(201, updatedProduct, "product updated successfully"));
}

// Function to delete a product
export async function DeleteProducts(req, res) {
  const { productId } = req.params;

  // Check if productId is provided in the request params
  if (!productId) return res.status(400).json(new ApiError(400, "please provide a Product Id"));

  // Delete the product by productId
  const product = await Product.findByIdAndDelete(productId);

  // If product not found, return error response
  if (!product) return res.status(404).json(new ApiError(404, "product not found with this id"));

  // Return success response indicating the product has been deleted
  return res.status(200).json(new ApiRespone(200, null, "product deleted successfully"));
}

// Function to get a product by its ID
export async function getProductById(req, res) {
  const { productId } = req.params;

  // Check if productId is provided in the request params
  if (!productId) return res.status(400).json(new ApiError(400, "please provide product id"));

  // Find the product by productId
  const product = await Product.findById(productId);

  // If product not found, return error response
  if (!product) return res.status(404).json(new ApiError(404, "no product found with this id"));

  // Return success response with the product details
  return res.status(200).json(new ApiRespone(200, product, "success"));
}

// Function to get all products with pagination
export async function getAllProducts(req, res) {
  const limit = req.params.limit || 10; // Default limit is 10 products
  const skip = req.params.skip || 0; // Default skip is 0 (no skipping)

  // Fetch products with limit and skip
  const products = await Product.find().limit(limit).skip(skip);

  // If no products are found, return error response
  if (!products) return res.status(404).json(new ApiError(404, "products not found"));

  // Return success response with the list of products
  return res.status(200).json(new ApiRespone(200, products, "success"));
}
