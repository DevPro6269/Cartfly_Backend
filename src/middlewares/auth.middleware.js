import jwt from "jsonwebtoken"
import ApiError from "../utilis/ApiError.js";

function isAuthenicate(req,res,next){
  const {accessToken}=req.cookies;

  if(!accessToken) return res.status(400).json(new ApiError(400,"invalid token or token not found"))

 jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
    if(err) return res.status(400).json(new ApiError(400,"invalid token"))
    req.user=user;
    next()
 })

}

export default isAuthenicate