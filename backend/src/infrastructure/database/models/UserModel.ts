import mongoose, { Document, Schema } from 'mongoose';
import { StaffActivity, UserRole } from '../../../domain/entities/User';

export interface UserDocument extends Document {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    permissions: string[];
    activityLog: StaffActivity[];
    lastActiveAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['CUSTOMER', 'SALES_STAFF', 'MANAGER', 'CRO', 'ADMIN'],
            default: 'CUSTOMER',
        },
        isActive: { type: Boolean, default: true },
        permissions: { type: [String], default: [] },
        activityLog: [
            {
                action: { type: String, required: true },
                performedBy: { type: String },
                details: { type: String },
                timestamp: { type: Date, default: Date.now },
            },
        ],
        lastActiveAt: { type: Date },
    },
    { timestamps: true }
);

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
