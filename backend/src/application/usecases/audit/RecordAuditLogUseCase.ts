import { AuditLog } from "../../../domain/entities/AuditLog";
import { IAuditLogRepository } from "../../../domain/repositories/IAuditLogRepository";

export class RecordAuditLogUseCase {
    constructor(private repo: IAuditLogRepository) {}

    async execute(entry: AuditLog) {
        return this.repo.create({ ...entry, createdAt: entry.createdAt ?? new Date() });
    }
}
