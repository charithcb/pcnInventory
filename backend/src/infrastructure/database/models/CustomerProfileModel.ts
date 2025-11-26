import mongoose, { Document, Schema } from "mongoose";
import { Address, CustomerProfile, NotificationPreferences } from "../../../domain/entities/CustomerProfile";

export type CustomerProfileDocument = Document & CustomerProfile;

const AddressSchema = new Schema<Address>(
    {
        line1: { type: String },
        line2: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String }
    },
    { _id: false }
);

const NotificationPreferencesSchema = new Schema<NotificationPreferences>(
    {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true },
        marketing: { type: Boolean, default: false }
    },
    { _id: false }
);

const CustomerProfileSchema = new Schema<CustomerProfileDocument>(
    {
        userId: { type: String, required: true, unique: true },
        phone: { type: String },
        address: { type: AddressSchema, default: {} },
        notificationPreferences: { type: NotificationPreferencesSchema, default: {} }
    },
    { timestamps: true }
);

export const CustomerProfileModel = mongoose.model<CustomerProfileDocument>(
    "CustomerProfile",
    CustomerProfileSchema
);
