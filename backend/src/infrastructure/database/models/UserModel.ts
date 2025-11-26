import mongoose, { Document, Schema } from 'mongoose';
import { UserRole } from '../../../domain/entities/User';

export interface UserDocument extends Document {
    name: string;
    email: string;
    password: string;
    role: UserRole;
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
    },
    { timestamps: true }
);

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
