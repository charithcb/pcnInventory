export interface Vehicle {
    id?: string;
    make: string;
    model: string;
    year: number;
    color?: string;
    mileage?: number;
    price?: number;
    stock?: number;
    purchaseCost?: number;
    sellingPrice?: number;
    category?: 'SUV' | 'SEDAN' | 'HYBRID' | 'ELECTRIC';
    lastUpdatedBy?: string;
    status?: 'AVAILABLE' | 'RESERVED' | 'SOLD';
    createdAt?: Date;
    updatedAt?: Date;
}
