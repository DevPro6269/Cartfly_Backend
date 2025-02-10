import ApiError from "../utilis/ApiError.js";
import Category from "../models/category.model.js";
import ApiRespone from "../utilis/ApiRespone.js";
import mongoose from "mongoose";

export async function addNewCategory(req, res) {
  const { category } = req.body;
  console.log(req.body);
  console.log(req.headers);
  
  if (!category)
    return res
      .status(400)
      .json(new ApiError(400, "please provide category name"));
    
   const isCategoryExist = await Category.findOne({category})
   if(isCategoryExist) return res.status(400).json(new ApiError(400,"catgeory already exist"))

      try {
        const response = await Category.create({ category });
    
        if (!response) {
          return res.status(500).json(new ApiError(500, "Error while saving category"));
        }
    
        return res.status(201).json(new ApiRespone(
             201,
             response,
             "Category created successfully",
          ));

      } catch (error) {
        return res.status(500).json(new ApiError(500, "Server error"));
      }
}



export async function getAllCategories(req,res) {
  const categories = await Category.find();
  if(!categories)return res.status(404).json(404,"no categories found");
  return res.status(200).json(new ApiRespone(200,categories,"success"))
}