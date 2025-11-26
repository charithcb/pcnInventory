export interface Appointment {
    id?: string;
    customerId: string;
    staffId?: string;

    date: string;       // example: '2025-11-30'
    time: string;       // example: '14:30'
    type: string;       // 'TEST_DRIVE', 'MEETING', 'SHOWROOM_VISIT', etc.

    notes?: string;

    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';

    createdAt?: Date;
    updatedAt?: Date;
}
