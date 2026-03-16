import { Request, Response } from "express";
import Order from "../models/order.models.js";
import Product from "../models/products.models.js";
import Cart from "../models/cart.models.js";

// Get user orders
// Get /api/orders
export const getOrders = async (req: Request, res: Response) => {
    try {
        const query = { user: req.user._id };
        const orders = await Order.find(query).populate('items.product', 'name images').sort('-createdAt');

        res
            .status(200)
            .json({
                success: true,
                message: 'Orders retrieved successfully',
                data: orders
            });
    } catch (error: any) {
        res
            .status(500)
            .json({
                success: false,
                message: 'Error retrieving orders',
                data: null
            });
    }
};

// Get Single Order
// Get /api/orders/:id
export const getOrder = async (req: Request, res: Response) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.product', 'name images');

        if (!order) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: 'Order not found',
                    data: null
                });
        }

        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res
                .status(403)
                .json({
                    success: false,
                    message: 'Unauthorized to view this order',
                })
        }

        res
            .status(200)
            .json({
                success: true,
                message: 'Order retrieved successfully',
                data: order
            });
    } catch (error: any) {
        res
            .status(500)
            .json({
                success: false,
                message: 'Error retrieving order',
                data: null
            });
    }
};

// Create order from cart
// Post /api/orders
export const createOrder = async (req: Request, res: Response) => {
    try {
        const { shippingAddress, notes } = req.body;
        const cart = await Cart.findOne({
            user: req.user._id
        }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: 'Cart not found',
                    data: null
                });
        }

        // Verify Stock and prepare order item
        const orderItems = [];
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);
            if (!product) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        message: 'Product not found',
                        data: null
                    });
            }
            if (product.stock < item.quantity) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: `Insufficient stock for ${(item.product as any).name}`,
                        data: null
                    });
            }
            orderItems.push({
                product: item.product._id,
                name: (item.product as any).name,
                quantity: item.quantity,
                price: item.price,
                size: item.size,
            });
            // Reduce Stock
            product.stock -= item.quantity;
            await product.save();
        }

        const subtotal = cart.totalAmount;
        const shippingCost = 2;
        const tax = 0;
        const totalAmount = subtotal + shippingCost + tax;

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            shippingAddress,
            paymentMethod: req.body.paymentMethod || 'cash',
            paymentStatus: 'pending',
            subtotal,
            shippingCost,
            tax,
            totalAmount,
            paymentIntentId: req.body.paymentIntentId,
            orderNumber: "oRD" + Date.now()
        });

        if (req.body.paymentMethod !== 'stripe') {
            cart.items = [];
            cart.totalAmount = 0;
            await cart.save();
        }

        res
            .status(201)
            .json({
                success: true,
                message: 'Order created successfully',
                data: order
            });
    } catch (error: any) {
        console.error("Create order error", error);
        res
            .status(500)
            .json({
                success: false,
                message: 'Error creating order: ' + error.message,
                data: null
            });
    }
};

// Update Order Status
// Put /api/orders/:id/status
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { orderStatus, paymentStatus } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: 'Order not found',
                    data: null
                });
        }

        if (orderStatus) {
            order.orderStatus = orderStatus;
        }

        if (paymentStatus) {
            order.paymentStatus = paymentStatus;
        }

        if (orderStatus == 'delivered') {
            order.deliveredAt = new Date();
        }

        await order.save();
        res
            .status(200)
            .json({
                success: true,
                message: 'Order status updated successfully',
                data: order
            });

    } catch (error: any) {
        res
            .status(500)
            .json({
                success: false,
                message: 'Error updating order status',
                data: null
            });
    }
};

// Get all orders
// Get /api/orders/admin/all
export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const query: any = {};

        if (status) {
            query.orderStatus = status;
        }

        const orders = await Order.find(query).populate('user', 'name email').populate('items.product', 'name images').sort('-createdAt').skip((Number(page) - 1) * Number(limit));
        const total = await Order.countDocuments(query);

        res
            .status(200)
            .json({
                success: true,
                message: 'Orders fetched successfully',
                data: orders,
                pagination: {
                    total,
                    page: Number(page),
                    pages: Math.ceil(total / Number(limit))
                }
            });
    } catch (error: any) {
        res
            .status(500)
            .json({
                success: false,
                message: 'Error fetching orders',
                data: null
            });
    }
};