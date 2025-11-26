export interface Reservation {
    id?: string;
    customerId: string;
    vehicleId: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
    reservedUntil?: Date; // optional, future use
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
