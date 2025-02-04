import express from "express";
import isAunthicate from "../middlewares/auth.middleware.js";
import { getOrders, newOrder, updateOrder } from "../controllers/order.controller.js";
import {isAdmin} from "../middlewares/isAdmin.middleware.js"


const router = express.Router();


router.route("/new").post(isAunthicate,newOrder)
router.get(isAunthicate,isAdmin,getOrders).put(isAunthicate,isAdmin,updateOrder)




export default router;