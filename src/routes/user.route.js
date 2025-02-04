import express from "express";
import { getUserDetails, loginUser, logoutUser, signupUser, updateUserDetails } from "../controllers/users.controller.js";
import WrapAsync from "../utilis/WrapAsync.js"
import isAuthenicate from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
const Router = express.Router()

Router.route("/signup").post(WrapAsync(signupUser))
Router.route("/login").post(WrapAsync(loginUser))

// secured routes 
Router.route("/logout").get(isAuthenicate,WrapAsync(logoutUser))
Router.route("/details").get(isAuthenicate,WrapAsync(getUserDetails))
Router.route("/update").put(isAuthenicate,isAdmin,updateUserDetails)
export default Router;