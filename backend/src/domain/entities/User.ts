export type UserRole = 'CUSTOMER' | 'SALES_STAFF' | 'MANAGER' | 'CRO' | 'ADMIN';

export interface StaffActivity {
    action: string;
    performedBy?: string;
    details?: string;
    timestamp: Date;
}

export interface User {
    id: string;
    name: string;
    email: string;
    password: string; // hashed
    role: UserRole;
    isActive: boolean;
    permissions: string[];
    activityLog?: StaffActivity[];
    lastActiveAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
