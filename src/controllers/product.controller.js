import { productValidateSchema } from "../../Schema.js";
import Product from "../models/prodcuts.module.js";
import ApiError from "../utilis/ApiError.js";
import ApiRespone from "../utilis/ApiRespone.js";
import { uploadOnCloudinary } from "../utilis/cloudnary.js";

export async function AddProduct(req, res) {
  const { error } = productValidateSchema.validate(req.body);

  if (error)
    return res
      .status(400)
      .json(new ApiError(400, error.details.map((e) => e.message).join(" ")));

  const thumbnailFile = req.files?.thumbnail ? req.files.thumbnail[0] : null;
  if (!thumbnailFile)
    return res
      .status(400)
      .json(new ApiError(400, "please provide valid thumbnail"));

  let result = await uploadOnCloudinary(req.files?.thumbnail[0].path);
  const thumbnailUrl = result?.url;

  if (!thumbnailUrl) {
    return res
      .status(400)
      .json(new ApiError(400, "Failed to upload thumbnail image"));
  }

  const productImages = req.files?.productImages ? req.files.productImages : [];

  let mediaUrls = [];

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
  } = req.body;

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
  });

  if (!product)
    return res
      .status(400)
      .json(new ApiError(400, "all feild must be required"));

  return res
    .status(201)
    .json(new ApiRespone(201, product, "product succesfully creted"));
}



export async function productDetailsById(req, res) {
  const { productId } = req.params;
  if (!productId)
    return res
      .status(400)
      .json(new ApiError(400, "product id is missing in parameters"));

  const productDetails = await Product.aggregate([
    {
      $match: { _id: productId },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "product",
        as: "cutomerReviews",
      },
    },

    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "tags",
        foreignField: "tags",
        as: "relatedProducts",
      },
    },
    {
      $project: {
        relatedProducts: {
          $slice: ["$relatedProducts", 5],
        },
      },
    },
  ]);

  if (productDetails.length == 0)
    return res
      .status(404)
      .json(new ApiError(404, "Products details not found"));

  return res.status(200).json(new ApiRespone(200, productDetails, "success"));
}



// admin routes for update product
export async function updateProductDetails(req, res) {
  const { productId } = req.params;
  if (!productId)
    return res.status(400).json(new ApiError(400, "please provide product id"));

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
    
      // If nothing to update, return an early response
      if (Object.keys(updateData).length === 0)
        return res.status(400).json(new ApiError(400, "No valid fields to update"));
    

 const updatedProduct = await Product.findByIdAndUpdate(productId,updateData,{new:true})


    if(!updatedProduct) return res.status(500).json(new ApiRespone(500,"internal server error"))

     return res.status(201).json(new ApiRespone(201,updatedProduct,"product upadated succesfully"))   

}
