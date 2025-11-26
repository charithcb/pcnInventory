import { AuditLog } from "../../../domain/entities/AuditLog";
import { AuditLogFilters, IAuditLogRepository } from "../../../domain/repositories/IAuditLogRepository";
import { AuditLogModel } from "../models/AuditLogModel";

export class MongoAuditLogRepository implements IAuditLogRepository {
    async create(entry: AuditLog): Promise<AuditLog> {
        const created = await AuditLogModel.create(entry);
        return created.toObject();
    }

    async find(filters: AuditLogFilters = {}): Promise<AuditLog[]> {
        const query: any = {};

        if (filters.userId) query.userId = filters.userId;
        if (filters.action) query.action = filters.action;
        if (filters.entityType) query.entityType = filters.entityType;
        if (filters.entityId) query.entityId = filters.entityId;
        if (typeof filters.success === "boolean") query.success = filters.success;

        if (filters.from || filters.to) {
            query.createdAt = {};
            if (filters.from) query.createdAt.$gte = filters.from;
            if (filters.to) query.createdAt.$lte = filters.to;
        }

        const results = await AuditLogModel.find(query).sort({ createdAt: -1 });
        return results.map((doc) => doc.toObject());
    }
}
