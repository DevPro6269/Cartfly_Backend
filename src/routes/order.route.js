import express from "express";
import isAunthicate from "../middlewares/auth.middleware.js";


const router = express.Router();



router.route("/new").post(isAunthicate,)




export default router;