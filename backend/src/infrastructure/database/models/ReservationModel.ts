import mongoose, { Schema, Document } from 'mongoose';
import { Reservation } from '../../../domain/entities/Reservation';

export type ReservationDocument = Document & Reservation;

const ReservationSchema = new Schema(
    {
        customerId: { type: String, required: true },
        vehicleId: { type: String, required: true },
        status: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
            default: 'PENDING'
        },
        reservedUntil: { type: Date },
        notes: { type: String }
    },
    { timestamps: true }
);

export const ReservationModel = mongoose.model<ReservationDocument>(
    'Reservation',
    ReservationSchema
);
