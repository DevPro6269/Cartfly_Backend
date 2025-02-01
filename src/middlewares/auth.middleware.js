import ApiError from "../utilis/ApiError.js";
import jwt from "jsonwebtoken"

function isAuthenicate(req,res,next){
    const token = req.cookies.accessToken||req.headers.authorization?.replace("JWT ","")
    
 if(!token) return res.status(403).json(new ApiError(403,"access denied !! No token Provided"))
 
 const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,decode)=>{
    if(err) res.status(401).json(new ApiError(401,"Invalid User Token or Expired"))
    req.user = decode;
    next()
 });

}

export default isAuthenicate;