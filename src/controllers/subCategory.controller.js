
import ApiError from '../utilis/ApiError.js';  
import ApiRespone from '../utilis/ApiRespone.js';  
import Category from '../models/category.model.js';  
import SubCategory from '../models/subCategory.model.js';  

export async function addSubCategory(req, res) {
    const { categoryId } = req.params;
    const { subCategory } = req.body;

    // Check if categoryId and subCategory are provided
    if (!categoryId) {
        return res.status(400).json(new ApiError(400, "Please provide category id"));
    }
    if (!subCategory) {
        return res.status(400).json(new ApiError(400, "Please provide sub category"));
    }

    // Check if the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
        return res.status(404).json(new ApiError(404, "No category found with this ID"));
    }

    // Check if the subcategory already exists
    const isSubCategoryExist = await SubCategory.findOne({ subCategory });
    if (isSubCategoryExist) {
        return res.status(400).json(new ApiError(400, "This subcategory already exists"));
    }

    // Create the new subcategory
    const newSubCategory = await SubCategory.create({
        category: categoryId,
        subCategory,
    });

    // Handle any server issues
    if (!newSubCategory) {
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }

    // Send success response
    res.status(201).json(new ApiRespone(201, newSubCategory, "Subcategory created successfully"));
}

export async function getSubCategories(req,res){
    const {category}=req.params;
    if(!category)return res.status(400).json(new ApiError(400,"please provide category id"))
     
        const getCategory = await Category.findOne({category});
        if(!getCategory)return res.status(404).json(new ApiError(404,"no category exist"));


      const subCategories = await SubCategory.find({category:getCategory.id})
  
  if(!subCategories)return res.status(404).json(404,"no Sub categories found with provided id ")
  
    return res.status(200).json(new ApiRespone(200,subCategories,"success"))
  }

