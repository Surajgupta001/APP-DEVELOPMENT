import { Request, Response } from "express";
import User from "../models/user.models.js";
import Product from "../models/products.models.js";
import Order from "../models/order.models.js";

// Get Dashboard Stats
// GET /api/admin/stats
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        const validOrders = await Order.find({
            orderStatus: {
                $ne: 'Cancelled'
            }
        });

        const totalRevenue = validOrders.reduce((sum, order) => sum + order.totalAmount, 0);

        const recentOrders = await Order.find().sort({
            createdAt: -1
        }).limit(5).populate('user', 'name email');

        res
            .status(200)
            .json({
            success: true,
            message: "Dashboard Stats",
            data: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue,
                recentOrders
            }
        });
    } catch (error: any) {
        res
            .status(500)
            .json({
                success: false,
                message: error.message
            });
    }
};