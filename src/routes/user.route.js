import express from "express";
import { loginUser, logoutUser, signupUser } from "../controllers/users.controller.js";
import WrapAsync from "../utilis/WrapAsync.js"
import isAuthenicate from "../middlewares/auth.middleware.js";
const Router = express.Router()

Router.route("/signup").post(WrapAsync(signupUser))
Router.route("/login").post(WrapAsync(loginUser))

// secured routes 
Router.route("/logout").get(isAuthenicate,WrapAsync(logoutUser))
export default Router;