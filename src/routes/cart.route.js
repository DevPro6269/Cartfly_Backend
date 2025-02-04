import express from "express";
import isAuthenticate from "../middlewares/auth.middleware.js";

const router = express.Router();


router.get(isAuthenticate,)
.post(isAuthenticate)
.put(isAuthenticate)
.delete(isAuthenticate)
export default router;