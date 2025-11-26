import mongoose, { Schema, Document } from 'mongoose';
import { Vehicle } from '../../../domain/entities/Vehicle';


export type VehicleDocument = Document & Vehicle;


const VehicleSchema = new Schema(
    {
        make: { type: String, required: true },
        model: { type: String, required: true },
        year: { type: Number, required: true },
        color: { type: String },
        mileage: { type: Number },
        price: { type: Number },
        stock: { type: Number, default: 0 },
        purchaseCost: { type: Number },
        sellingPrice: { type: Number },
        category: {
            type: String,
            enum: ['SUV', 'SEDAN', 'HYBRID', 'ELECTRIC'],
            default: 'SEDAN'
        },
        lastUpdatedBy: { type: String },
        status: {
            type: String,
            enum: ['AVAILABLE', 'RESERVED', 'SOLD'],
            default: 'AVAILABLE',
        },
    },
    {
        timestamps: true,
    }
);

export const VehicleModel = mongoose.model<VehicleDocument>(
    'Vehicle',
    VehicleSchema
);


