import { Request, Response } from 'express';
import Cart from '../models/cart.models.js';
import Product from '../models/products.models.js';

// Get user cart
// GET /api/cart
export const getCart = async (req: Request, res: Response) => {
    try {
        let cart = await Cart.findOne({
            user: req.user._id
        })
            .populate('items.product', 'name images price stock');

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [],
            })
        }

        res
            .status(200)
            .json({
                success: true,
                message: 'Cart retrieved successfully',
                data: cart
            });
    } catch (error: any) {
        console.error('Get cart error', error);
        res
            .status(500)
            .json({
                success: false,
                message: 'Server error'
            });
    }
};

// Add Item to Cart
// POST /api/cart
export const addToCart = async (req: Request, res: Response) => {
    try {
        const { productId, quantity = 1, size } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: 'Product not found'
                });
        }

        if (product.stock < quantity) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'Insufficient stock'
                });
        }

        let cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [],
            });
        }

        // Find item with same product and size
        const existingItem = cart.items.find((item) => {
            return item.product.toString() === productId && item.size === size;
        });

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.price = product.price;
        } else {
            cart.items.push({
                product: productId,
                quantity,
                price: product.price,
                size
            })
        }

        cart.totalAmount = cart.items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
        await cart.save();

        await cart.populate('items.product', 'name images price stock');

        res
            .status(200)
            .json({
                success: true,
                message: 'Item added to cart successfully',
                data: cart
            });
    } catch (error: any) {
        console.error('Add to cart error', error);
        res
            .status(500)
            .json({
                success: false,
                message: 'Server error'
            });
    }
};

// Update Cart Item Quantity
// PUT /api/cart/item/:productId
export const updateCartItem = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const { quantity, size } = req.body;

        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: 'Cart not found'
                });
        }

        const item = cart.items.find((item) => {
            return item.product.toString() === productId && item.size === size;
        });

        if (!item) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: 'Item not found in cart'
                });
        }

        if (quantity <= 0) {
            cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        } else {
            const product = await Product.findById(productId);
            if (product!.stock < quantity) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: 'Insufficient stock'
                    });
            }
            item.quantity = quantity;
        }

        cart.totalAmount = cart.items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
        await cart.save();
        await cart.populate('items.product', 'name images price stock');

        res
            .status(200)
            .json({
                success: true,
                message: 'Item quantity updated successfully',
                data: cart
            });
    } catch (error: any) {
        console.error('Update cart item error', error);
        res
            .status(500)
            .json({
                success: false,
                message: 'Server error'
            });
    }
};

// Remove Item from Cart
// DELETE /api/cart/item/:productId
export const removeCartItem = async (req: Request, res: Response) => {
    try {
        const { size } = req.query;
        const cart = await Cart.findOne({
            user: req.user._id,
        });

        if (!cart || !size) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: 'Cart not found'
                })
        }

        cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId || item.size !== size);

        cart.totalAmount = cart.items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
        await cart.save();
        await cart.populate('items.product', 'name images price stock');

        res
            .status(200)
            .json({
                success: true,
                message: 'Item removed from cart successfully',
                data: cart
            });

    } catch (error: any) {
        console.error('Remove cart item error', error);
        res
            .status(500)
            .json({
                success: false,
                message: 'Server error'
            });
    }
};

// Clear Cart
// DELETE /api/cart
export const clearCart = async (req: Request, res: Response) => {
    try {
        const cart = await Cart.findOne({
            user: req.user._id,
        });

        if (cart) {
            cart.items = [];
            cart.totalAmount = 0;
            await cart.save();

            res
                .status(200)
                .json({
                    success: true,
                    message: 'Cart cleared successfully',
                    data: cart
                });
        }
    } catch (error: any) {
        console.error('Clear cart error', error);
        res
            .status(500)
            .json({
                success: false,
                message: 'Server error'
            });
    }
};