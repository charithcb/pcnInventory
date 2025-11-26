import mongoose, { Schema, Document } from 'mongoose';
import { Notification } from '../../../domain/entities/Notification';

export type NotificationDocument = Document & Notification;

const NotificationSchema = new Schema(
    {
        userId: { type: String, required: true },
        message: { type: String, required: true },
        type: { type: String, required: true },
        read: { type: Boolean, default: false }
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export const NotificationModel = mongoose.model<NotificationDocument>(
    'Notification',
    NotificationSchema
);
