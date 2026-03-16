import express from 'express';
import { authorize, protect } from '../middleware/auth.js';
import { createOrder, getAllOrders, getOrder, getOrders, updateOrderStatus } from '../controllers/order.controllers.js';

const OrderRouter = express.Router();

// Get user orders
OrderRouter.get('/', protect, getOrders);

// Get all orders (admin only) - This route can be implemented later when we have order management features for admins
OrderRouter.get('/admin/all', protect, authorize('admin'), getAllOrders);

// Get single order
OrderRouter.get('/:id', protect, getOrder);

// Create order from cart
OrderRouter.post('/', protect, createOrder);

// Update order status (admin only) - This route can be implemented later when we have order status management
OrderRouter.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

export default OrderRouter;