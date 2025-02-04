import express from "express";
import isAuthenticate from "../middlewares/auth.middleware.js"
import { addNewAddress, deleteAddress, updateAddress } from "../controllers/address.controller.js";

const router = express.Router();

router.route("/new").post(isAuthenticate,addNewAddress)
router.put(isAuthenticate,updateAddress)
router.delete(isAuthenticate,deleteAddress)

export default router;