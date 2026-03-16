import express from 'express';
import { protect } from '../middleware/auth.js';
import { getWishlist, toggleWishlistItem } from '../controllers/wishlist.controllers.js';

const WishlistRouter = express.Router();

// Get user wishlist
WishlistRouter.get('/', protect, getWishlist);

// Toggle item in wishlist
WishlistRouter.post('/toggle', protect, toggleWishlistItem);

export default WishlistRouter;