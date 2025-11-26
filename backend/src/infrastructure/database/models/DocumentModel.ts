import mongoose, { Schema, Document } from "mongoose";
import { DocumentEntity } from "../../../domain/entities/Document";

export interface DocumentRecord extends Document, DocumentEntity {}

const DocumentSchema = new Schema(
    {
        ownerType: { type: String, required: true },
        ownerId: { type: String, required: true },

        type: { type: String, required: true },

        filename: { type: String, required: true },
        url: { type: String, required: true },

        uploadedBy: { type: String, required: true },
        verified: { type: Boolean, default: false }
    },
    { timestamps: true }
);

export const DocumentModel = mongoose.model<DocumentRecord>(
    "Document",
    DocumentSchema
);
