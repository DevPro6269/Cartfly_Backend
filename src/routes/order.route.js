import express from "express";
import isAunthicate from "../middlewares/auth.middleware.js";
import { getOrders, newOrder, updateOrder } from "../controllers/order.controller.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = express.Router();

// Route to create a new order
router.route("/new").post(isAunthicate, newOrder);

// Route to get orders and update order (separated correctly)
router.get("/", isAunthicate, isAdmin, getOrders);
router.put("/:orderId", isAunthicate, isAdmin, updateOrder);

export default router;
