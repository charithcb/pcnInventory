export interface Inquiry {
    id?: string;
    customerId: string;
    subject: string;
    message: string;
    vehicleId?: string;
    status: 'OPEN' | 'ANSWERED' | 'CLOSED';
    staffReply?: string;
    staffId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
