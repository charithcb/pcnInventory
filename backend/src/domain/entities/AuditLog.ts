export type AuditAction =
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAILURE'
    | 'DOCUMENT_UPLOADED'
    | 'TRACKING_CREATED'
    | 'TRACKING_STATUS_CHANGED'
    | 'VEHICLE_CREATED'
    | 'VEHICLE_UPDATED'
    | 'VEHICLE_DELETED'
    | 'CUSTOMER_RECORD_UPDATED'
    | 'ORDER_UPDATED'
    | 'INQUIRY_STATUS_CHANGED'
    | 'APPOINTMENT_UPDATED';

export interface AuditLog {
    id?: string;
    userId?: string;
    action: AuditAction;
    entityType?: string;
    entityId?: string;
    success?: boolean;
    description?: string;
    metadata?: Record<string, any>;
    createdAt?: Date;
}
