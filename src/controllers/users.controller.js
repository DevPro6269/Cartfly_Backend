import {userValidateSchema} from "../../Schema.js"
import ApiError from "../utilis/ApiError.js"
import User from "../models/user.module.js"
import ApiResponse from "../utilis/ApiRespone.js"
import generateAccessToken from "../utilis/generateAccessToken.js";


const cookieOptions = {
   httpOnly:true,
   secure:process.env.NODE_ENV==="production",
   maxAge:3600000
}

 export async function signupUser(req,res){
  const {username,email,password}=req.body;
   const {error} = userValidateSchema.validate(req.body);
   if(error){
    const errMsg = error.details.map(err => err.message).join(', ')
   return res.status(400).json(new ApiError(400,errMsg))
   };
   const isValidEmail = await User.findOne({email})   
   if(isValidEmail) return res.status(400).json(new ApiError(400,"email already registerd"));

   const user = await User.create({
    username,
    email,
    password
   })
  const token =  generateAccessToken(user.id)

   user.password=undefined
  
   res.cookie("accessToken",token,cookieOptions)
res.status(201).json(new ApiResponse(201,user,"user signup succesfully"))
} 

export async function loginUser(req,res){
const{email,password} = req.body;
if (!email || !password) return res.status(401).json(new ApiError(401,"username And password is required"))
   const user = await User.findOne({email});
   if(!user) return res.status(400).json(new ApiError(400,"email does not exist"));
    
   const isValidPassword =  await user.isCorrectPassword(password);
   
   if(!isValidPassword) return res.status(400).json(new ApiError(400,"Password is not Valid"));
   const token = generateAccessToken(user.id);
    res.cookie("accessToken",token,cookieOptions)
    user.password = undefined
    res.status(200).json(new ApiResponse(200,user,"user login successfully"))
}

export async function logoutUser(req,res){
  const {id} = req.user

  const user = await User.findById(id);
  if(!user) return res.status(400).json(400,"User does not exist")
   
   res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "Strict",  
    });

    res.status(200).json(new ApiResponse(200,user,"user logout succesfully"))

}

export async function getUserDetails(req,res){
   const user = req.user;
  
   const userDetails = await User.aggregate([
      {
         $match:{
            email:user.email
         }
      },
      {
         $lookup:{
            from:"orders",
            localField:"_id",
            foreignField:"owner",
            as:"orders"
         }
      },
      {
         $lookup:{
            from:"addresses",
            localField:"_id",
            foreignField:"user",
            as:"addresses"
         }
      },

      {
         $lookup:{
            from:"carts",
            localField:"_id",
            foreignField:"owner",
            as:"cartDetails"
         }
      },
   ])


if(!userDetails||userDetails.length==0)return res.status(404).json(new ApiError(404,"user details not found"));

userDetails[0].password=undefined;

return res.status(200).json(new ApiResponse(200,userDetails,"success"))
}

export async function updateUserDetails(req,res) {
   const user = req.user ;
   if(!user) return res.status(404).json(new ApiError(404,"user not found"));

   
    const{role}=req.body;
    if(!role)return res.status(400).json(new ApiError(400,"please provide a valid rold"));

  user.role=role

  await user.save()

res.status(201).json(new ApiResponse(201,null,"user role is changed"))

}