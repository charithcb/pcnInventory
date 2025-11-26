import mongoose, { Schema, Document } from "mongoose";
import { DeliveryTracking, TrackingStatus } from "../../../domain/entities/DeliveryTracking";

export interface DeliveryTrackingDocument extends Document, DeliveryTracking {}

const TimelineSchema = new Schema(
    {
        status: { type: String, required: true },
        date: { type: String, required: true },
        notes: { type: String },
        updatedBy: { type: String, required: true }
    },
    { _id: false }
);

const DeliveryTrackingSchema = new Schema(
    {
        orderId: { type: String, required: true },
        vehicleId: { type: String, required: true },
        customerId: { type: String, required: true },

        currentStatus: { type: String, default: "PENDING" },

        eta: { type: String },

        statusTimeline: { type: [TimelineSchema], default: [] }
    },
    { timestamps: true }
);

export const DeliveryTrackingModel = mongoose.model<DeliveryTrackingDocument>(
    "DeliveryTracking",
    DeliveryTrackingSchema
);
