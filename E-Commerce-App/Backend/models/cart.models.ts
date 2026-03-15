import mongoose, { Schema } from "mongoose";
import { ICart, ICartItem } from "../types/index.js";

const cartItemSchema = new mongoose.Schema<ICartItem>({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    price: {
        type: Number,
        required: true,
    },
    size: {
        type: String,
    }
});

const cartSchema = new Schema<ICart>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [cartItemSchema],
    totalAmount: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});

const Cart = mongoose.model<ICart>('Cart', cartSchema);

export default Cart;