import express from 'express'
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/product.controllers.js';
import upload from '../middleware/upload.js';
import { authorize, protect } from '../middleware/auth.js';

const ProductRouter = express.Router();

// Get All Products
ProductRouter.get('/', getProducts);

// Get Single Product
ProductRouter.get('/:id', getProduct);

// Create product (Admin Only)
ProductRouter.post('/', upload.array('images', 5), protect, authorize('admin'), createProduct);

// Update Product (Admin Only)
ProductRouter.put('/:id', protect, authorize('admin'), updateProduct);

// Delete Product (Admin Only)
ProductRouter.delete('/:id', protect, authorize('admin'), deleteProduct);

export default ProductRouter;