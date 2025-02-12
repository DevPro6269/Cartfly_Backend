import express from "express";
import { getUserDetails, loginUser, logoutUser, signupUser, updateUserDetails } from "../controllers/users.controller.js";
import WrapAsync from "../utilis/WrapAsync.js"
import isAuthenicate from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const Router = express.Router()

// Public route for user signup
Router.route("/signup").post(WrapAsync(signupUser))

// Public route for user login
Router.route("/login").post(WrapAsync(loginUser))

// Secured route for user logout (requires authentication)
Router.route("/logout").get(isAuthenicate, WrapAsync(logoutUser))

// Secured route to get user details (requires authentication)
Router.route("/details").get(isAuthenicate, WrapAsync(getUserDetails))

// Secured route to update user details (requires authentication and admin privileges)
Router.route("/update").put(isAuthenicate, isAdmin, updateUserDetails)

export default Router;
