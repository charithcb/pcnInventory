import mongoose, { Schema, Document } from 'mongoose';
import { Appointment } from '../../../domain/entities/Appointment';

export type AppointmentDocument = Document & Appointment;

const AppointmentSchema = new Schema(
    {
        customerId: { type: String, required: true },
        staffId: { type: String },

        date: { type: String, required: true },
        time: { type: String, required: true },
        type: { type: String, required: true },

        notes: { type: String },

        status: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED'],
            default: 'PENDING'
        }
    },
    { timestamps: true }
);

export const AppointmentModel = mongoose.model<AppointmentDocument>(
    'Appointment',
    AppointmentSchema
);
