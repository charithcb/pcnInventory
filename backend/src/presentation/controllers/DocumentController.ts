import { Request, Response } from "express";

import { MongoDocumentRepository } from "../../infrastructure/database/repositories/MongoDocumentRepository";

import { UploadDocumentUseCase } from "../../application/usecases/document/UploadDocumentUseCase";
import { GetDocumentsByOwnerUseCase } from "../../application/usecases/document/GetDocumentsByOwnerUseCase";
import { VerifyDocumentUseCase } from "../../application/usecases/document/VerifyDocumentUseCase";
import { DeleteDocumentUseCase } from "../../application/usecases/document/DeleteDocumentUseCase";
import { logAudit } from "../../shared/services/auditLogger";

const repo = new MongoDocumentRepository();

export class DocumentController {

    // ---------------------------------------------------------
    // UPLOAD DOCUMENT (Customer or Staff/Admin)
    // ---------------------------------------------------------
    static async upload(req: Request, res: Response) {
        try {
            const file = req.file;

            if (!file) {
                return res.status(400).json({ message: "No file uploaded" });
            }

            const useCase = new UploadDocumentUseCase(repo);

            const created = await useCase.execute({
                ownerType: req.body.ownerType,
                ownerId: req.body.ownerId,
                type: req.body.type,
                filename: file.filename,
                url: `/uploads/${file.filename}`,
                uploadedBy: req.user!.userId,
                verified: false
            });

            await logAudit({
                action: 'DOCUMENT_UPLOADED',
                userId: req.user!.userId,
                entityType: 'DOCUMENT',
                entityId: created.id,
                success: true,
                description: `Document ${created.filename} uploaded`,
                metadata: {
                    ownerType: created.ownerType,
                    ownerId: created.ownerId,
                    type: created.type
                }
            });

            res.status(201).json(created);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }

    // ---------------------------------------------------------
    // GET DOCUMENTS BY OWNER (Customer OR Admin/Staff)
    // ---------------------------------------------------------
    static async getMyDocuments(req: Request, res: Response) {
        try {
            const useCase = new GetDocumentsByOwnerUseCase(repo);
            const docs = await useCase.execute("CUSTOMER", req.user!.userId);

            res.json(docs);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getByOwner(req: Request, res: Response) {
        try {
            const { ownerType, ownerId } = req.params;

            const useCase = new GetDocumentsByOwnerUseCase(repo);
            const docs = await useCase.execute(ownerType, ownerId);

            res.json(docs);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    // ---------------------------------------------------------
    // VERIFY DOCUMENT (Manager/Admin)
    // ---------------------------------------------------------
    static async verify(req: Request, res: Response) {
        try {
            const docId = req.params.id;
            const { verified } = req.body;

            const useCase = new VerifyDocumentUseCase(repo);
            const updated = await useCase.execute(docId, verified);

            if (!updated) {
                return res.status(404).json({ message: "Document not found" });
            }

            await logAudit({
                action: 'DOCUMENT_UPLOADED',
                userId: req.user!.userId,
                entityType: 'DOCUMENT',
                entityId: updated.id,
                success: true,
                description: `Document ${updated.filename} verification updated`,
                metadata: { verified: updated.verified }
            });

            res.json(updated);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    // ---------------------------------------------------------
    // DELETE DOCUMENT (Manager/Admin)
    // ---------------------------------------------------------
    static async delete(req: Request, res: Response) {
        try {
            const docId = req.params.id;

            const useCase = new DeleteDocumentUseCase(repo);
            const ok = await useCase.execute(docId);

            if (!ok) {
                return res.status(404).json({ message: "Document not found" });
            }

            await logAudit({
                action: 'DOCUMENT_UPLOADED',
                userId: req.user!.userId,
                entityType: 'DOCUMENT',
                entityId: docId,
                success: true,
                description: `Document ${docId} deleted`
            });

            res.json({ deleted: true });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
