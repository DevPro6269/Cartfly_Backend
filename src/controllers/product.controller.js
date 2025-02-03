import { productValidateSchema } from "../../Schema.js"
import Product from "../models/prodcuts.module.js";
import ApiError from "../utilis/ApiError.js";
import ApiRespone from "../utilis/ApiRespone.js";
import {uploadOnCloudinary} from '../utilis/cloudnary.js'


export async function AddProduct(req,res){

    const {error} =  productValidateSchema.validate(req.body)


    if(error) return res.status(400).
    json(new ApiError(400,error.details.map((e)=>e.message).join(" ")))


    const thumbnailFile = req.files?.thumbnail ? req.files.thumbnail[0] : null;
    if(!thumbnailFile) return res.status(400).json(new ApiError(400,"please provide valid thumbnail"));


     let result =  await uploadOnCloudinary(req.files?.thumbnail[0].path)
     const thumbnailUrl = result?.url

     if (!thumbnailUrl) {
        return res.status(400).json(new ApiError(400, "Failed to upload thumbnail image"));
    }

    const productImages = req.files?.productImages ? req.files.productImages : [];

    
    let mediaUrls=[];

    for (const image of productImages) {
        try {
            const imageResult = await uploadOnCloudinary(image.path);
            mediaUrls.push(imageResult.url);
        } catch (error) {
            return res.status(500).json(new ApiError(500, "Error uploading product images to Cloudinary"));
        }
    }
    
    const{
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
        quantity
    }=req.body

  const product =  await Product.create({
        title,
        description,
        price,
        discount,
        Availability,
        returnPolicyDays,
        mediaUrls,
        tags,
        brandName,
        deliveryCharge,
        colors,
        thumbnailUrl,
        quantity
    })

   if(!product) return res.status(400).json(new ApiError(400,"all feild must be required"))
  
    return res.status(201).json(new ApiRespone(201,product,"product succesfully creted"))

}

// function for update product detils
