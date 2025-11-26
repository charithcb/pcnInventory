import { Vehicle } from "../entities/Vehicle";

export interface IVehicleRepository {
    create(data: Vehicle): Promise<Vehicle>;
    findAll(): Promise<Vehicle[]>;
    findById(id: string): Promise<Vehicle | null>;
    update(id: string, data: Partial<Vehicle>): Promise<Vehicle | null>;
    delete(id: string): Promise<boolean>;

    // 🔥 Add this
    filter(query: any): Promise<Vehicle[]>;
    findLowStock(threshold: number): Promise<Vehicle[]>;
}

