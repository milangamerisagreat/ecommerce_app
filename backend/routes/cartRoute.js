import express from "express";
import { isauthenticated } from "../middleware/isAuthonticated.js";
import {getCart, addToCart, updateQuantity, removeFromCart} from "../controllers/cartController.js"


const router = express.Router();

router.get("/", isauthenticated, getCart );
router.post("/add", isauthenticated, addToCart );
router.put("/update", isauthenticated, updateQuantity );
router.delete("/remove", isauthenticated, removeFromCart );



export default router;