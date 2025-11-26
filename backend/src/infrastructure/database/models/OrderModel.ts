import mongoose, { Schema, Document } from 'mongoose';
import { Order } from '../../../domain/entities/Order';

export type OrderDocument = Document & Order;

const OrderSchema = new Schema(
    {
        customerId: { type: String, required: true },
        vehicleId: { type: String, required: true },
        status: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'REJECTED', 'PROCESSING', 'COMPLETED'],
            default: 'PENDING'
        },
        notes: { type: String }
    },
    { timestamps: true }
);

export const OrderModel = mongoose.model<OrderDocument>('Order', OrderSchema);
