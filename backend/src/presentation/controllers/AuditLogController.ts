import { Request, Response } from "express";
import { MongoAuditLogRepository } from "../../infrastructure/database/repositories/MongoAuditLogRepository";
import { GetAuditLogsUseCase } from "../../application/usecases/audit/GetAuditLogsUseCase";

const repo = new MongoAuditLogRepository();

export class AuditLogController {
    static async list(req: Request, res: Response) {
        try {
            const useCase = new GetAuditLogsUseCase(repo);
            const filters = {
                userId: req.query.userId as string | undefined,
                action: req.query.action as any,
                entityType: req.query.entityType as string | undefined,
                entityId: req.query.entityId as string | undefined,
                success: typeof req.query.success === "string" ? req.query.success === "true" : undefined,
                from: req.query.from ? new Date(req.query.from as string) : undefined,
                to: req.query.to ? new Date(req.query.to as string) : undefined,
            };

            const logs = await useCase.execute(filters);
            res.json(logs);
        } catch (error) {
            console.error("Failed to fetch audit logs", error);
            res.status(500).json({ message: "Failed to fetch audit logs" });
        }
    }
}
