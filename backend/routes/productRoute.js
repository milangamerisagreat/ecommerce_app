import express from "express";
import { addProduct, getAllProduct } from "../controllers/productController.js";
import { isAdmin, isauthenticated } from "../middleware/isAuthonticated.js";
import { multipleUpload } from "../middleware/multer.js";


const router = express.Router();

router.post("/add", isauthenticated, isAdmin, multipleUpload, addProduct);
router.get("/get-all", getAllProduct);

export default router;