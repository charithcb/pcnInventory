import { AuditLogFilters, IAuditLogRepository } from "../../../domain/repositories/IAuditLogRepository";

export class GetAuditLogsUseCase {
    constructor(private repo: IAuditLogRepository) {}

    async execute(filters: AuditLogFilters = {}) {
        return this.repo.find(filters);
    }
}
