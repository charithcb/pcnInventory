export interface Order {
    id?: string;
    customerId: string;       // user placing the order
    vehicleId: string;        // vehicle being purchased
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSING' | 'COMPLETED';
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
