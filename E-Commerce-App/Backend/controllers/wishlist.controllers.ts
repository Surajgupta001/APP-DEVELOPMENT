import { Request, Response } from 'express';
import Wishlist from '../models/wishlist.models.js';
import Product from '../models/products.models.js';

// Get user wishlist
// GET /api/wishlist
export const getWishlist = async (req: Request, res: Response) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id })
            .populate('products');

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user._id, products: [] });
        }

        res.status(200).json({
            success: true,
            message: 'Wishlist retrieved successfully',
            data: wishlist
        });
    } catch (error: any) {
        console.error('Get wishlist error', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Toggle item in wishlist (Add/Remove)
// POST /api/wishlist/toggle
export const toggleWishlistItem = async (req: Request, res: Response) => {
    try {
        const { productId } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user._id, products: [] });
        }

        const productIndex = wishlist.products.findIndex(p => p.toString() === productId);

        let isAdded = false;
        if (productIndex > -1) {
            // Remove from wishlist
            wishlist.products.splice(productIndex, 1);
        } else {
            // Add to wishlist
            wishlist.products.push(productId);
            isAdded = true;
        }

        await wishlist.save();
        await wishlist.populate('products');

        res.status(200).json({
            success: true,
            message: isAdded ? 'Added to wishlist' : 'Removed from wishlist',
            data: wishlist
        });

    } catch (error: any) {
        console.error('Toggle wishlist error', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};