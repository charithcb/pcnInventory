import { AuditAction, AuditLog } from "../../domain/entities/AuditLog";
import { MongoAuditLogRepository } from "../../infrastructure/database/repositories/MongoAuditLogRepository";
import { RecordAuditLogUseCase } from "../../application/usecases/audit/RecordAuditLogUseCase";

const repo = new MongoAuditLogRepository();
const recorder = new RecordAuditLogUseCase(repo);

export async function logAudit(entry: Omit<AuditLog, "action"> & { action: AuditAction }) {
    try {
        await recorder.execute(entry);
    } catch (error) {
        console.error("Failed to record audit log", error);
    }
}
