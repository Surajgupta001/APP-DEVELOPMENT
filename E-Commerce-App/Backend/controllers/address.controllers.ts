import { Request, Response } from "express";
import Address from "../models/address.models.js";

// Get Your Addresses
// Get /api/addresses
export const getAddresses = async (req: Request, res: Response) => {
    try {
        const addressess = await Address.find({
            user: req.user._id
        }).sort({
            isDefault: -1,
            createdAt: -1
        });

        res
            .status(200)
            .json({
                success: true,
                message: "Your Addresses",
                data: addressess
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

// Add New Address
// Post /api/addresses
export const addAddress = async (req: Request, res: Response) => {
    try {
        const { type, street, city, state, zipCode, country, isDefault } = req.body;

        if (isDefault) {
            await Address.updateMany({
                user: req.user._id
            }, {
                isDefault: false
            });
        }

        const newAddress = await Address.create({
            user: req.user._id,
            type,
            street,
            city,
            state,
            zipCode,
            country,
            isDefault: isDefault || false
        });

        res
            .status(201)
            .json({
                success: true,
                message: "Address Added Successfully",
                data: newAddress
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

// Update Address
// Put /api/addresses/:id
export const updateAddress = async (req: Request, res: Response) => {
    try {
        const { type, street, city, state, zipCode, country, isDefault } = req.body;

        let addressItem = await Address.findById(req.params.id);

        if (!addressItem) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Address Not Found"
                });
        }

        // Ensure user owns the address
        if (addressItem.user.toString() !== req.user._id.toString()) {
            return res
                .status(403)
                .json({
                    success: false,
                    message: "Unauthorized"
                });
        }

        if (isDefault) {
            await Address.updateMany({
                user: req.user._id
            }, {
                isDefault: false
            });
        }

        addressItem = await Address.findByIdAndUpdate(req.params.id, {
            type,
            street,
            city,
            state,
            zipCode,
            country,
            isDefault
        }, {
            new: true,
        });

        res
            .status(200)
            .json({
                success: true,
                message: "Address Updated Successfully",
                data: addressItem
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

// Delete Address
// Delete /api/addresses/:id
export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Address Not Found"
                });
        }

        // Ensure user owns the address
        if (address.user.toString() !== req.user._id.toString()) {
            return res
                .status(403)
                .json({
                    success: false,
                    message: "Unauthorized"
                });
        }

        await address.deleteOne();

        res
            .status(200)
            .json({
                success: true,
                message: "Address Deleted Successfully"
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