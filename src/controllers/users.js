import userValidateSchema from "../../Schema.js"
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
res.status(200).json(new ApiResponse(200,user,"user signup succesfully"))
} 


export async function loginUser(req,res){
const{username,password} = req.body;
if (!username || !password) return res.status(401).json(new ApiError(401,"username And password is required"))
   const user = await User.findOne({username});
   if(!user) return res.status(400).json(new ApiError(400,"username does not exist"));
    
   const isValidPassword =  await user.isCorrect(password);
   
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