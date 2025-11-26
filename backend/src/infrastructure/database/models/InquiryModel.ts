import mongoose, { Schema, Document } from 'mongoose';
import { Inquiry } from '../../../domain/entities/Inquiry';

export type InquiryDocument = Document & Inquiry;

const InquirySchema = new Schema(
    {
        customerId: { type: String, required: true },
        subject: { type: String, required: true },
        message: { type: String, required: true },
        vehicleId: { type: String },
        status: {
            type: String,
            enum: ['OPEN', 'ANSWERED', 'CLOSED'],
            default: 'OPEN'
        },
        staffReply: { type: String },
        staffId: { type: String }
    },
    { timestamps: true }
);

export const InquiryModel = mongoose.model<InquiryDocument>(
    'Inquiry',
    InquirySchema
);
