import { AuditLog } from "../entities/AuditLog";

export interface AuditLogFilters {
    userId?: string;
    action?: AuditLog['action'];
    entityType?: string;
    entityId?: string;
    success?: boolean;
    from?: Date;
    to?: Date;
}

export interface IAuditLogRepository {
    create(entry: AuditLog): Promise<AuditLog>;
    find(filters?: AuditLogFilters): Promise<AuditLog[]>;
}
