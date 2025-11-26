import mongoose, { Document, Schema } from "mongoose";
import { AuditLog } from "../../../domain/entities/AuditLog";

export type AuditLogDocument = Document & AuditLog;

const AuditLogSchema = new Schema(
    {
        userId: { type: String },
        action: { type: String, required: true },
        entityType: { type: String },
        entityId: { type: String },
        success: { type: Boolean, default: true },
        description: { type: String },
        metadata: { type: Schema.Types.Mixed }
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLogModel = mongoose.model<AuditLogDocument>("AuditLog", AuditLogSchema);
