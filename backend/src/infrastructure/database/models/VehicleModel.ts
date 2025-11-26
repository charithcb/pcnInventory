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


