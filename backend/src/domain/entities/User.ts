export type UserRole = 'CUSTOMER' | 'SALES_STAFF' | 'MANAGER' | 'CRO' | 'ADMIN';

export interface User {
    id: string;
    name: string;
    email: string;
    password: string; // hashed
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
