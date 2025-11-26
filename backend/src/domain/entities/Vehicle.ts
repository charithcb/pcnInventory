export interface Vehicle {
    id?: string;
    make: string;
    model: string;
    year: number;
    color?: string;
    mileage?: number;
    price?: number;
    status?: 'AVAILABLE' | 'RESERVED' | 'SOLD';
    createdAt?: Date;
    updatedAt?: Date;
}
