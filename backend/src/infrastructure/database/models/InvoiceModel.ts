import mongoose, { Schema, Document } from 'mongoose';
import { Invoice } from '../../../domain/entities/Invoice';

export interface InvoiceDocument extends Document, Invoice {}

const InvoiceItemSchema = new Schema(
    {
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        total: { type: Number, required: true }
    },
    { _id: false }
);

const InvoiceSchema = new Schema(
    {
        orderId: { type: String, required: true },
        customerId: { type: String, required: true },
        issuedBy: { type: String, required: true },
        items: { type: [InvoiceItemSchema], required: true },
        subtotal: { type: Number, required: true },
        tax: { type: Number, default: 0 },
        total: { type: Number, required: true },
        status: {
            type: String,
            enum: ['PENDING', 'PAID', 'VOID'],
            default: 'PENDING'
        },
        issuedAt: { type: Date, default: Date.now },
        dueDate: { type: Date }
    },
    { timestamps: true }
);

export const InvoiceModel = mongoose.model<InvoiceDocument>(
    'Invoice',
    InvoiceSchema
);
