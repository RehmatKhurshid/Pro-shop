import express from "express";
import {getProducts, getProductById, deleteProduct, createProduct, updatedProduct, createProductReview} from '../controllers/productController.js'
import { isAdmin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);

router.post("/", protect, isAdmin, createProduct);

router.get('/:id', getProductById);

router.put('/:id', protect, isAdmin, updatedProduct);

router.delete('/:id', protect, isAdmin, deleteProduct);

router.post('/:id/review', protect, createProductReview)

export default router