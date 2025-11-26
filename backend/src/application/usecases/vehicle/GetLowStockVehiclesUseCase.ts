import { IVehicleRepository } from "../../../domain/repositories/IVehicleRepository";
import { Vehicle } from "../../../domain/entities/Vehicle";

export class GetLowStockVehiclesUseCase {
    constructor(private vehicleRepo: IVehicleRepository) {}

    async execute(threshold: number): Promise<Vehicle[]> {
        if (!Number.isFinite(threshold)) {
            throw new Error('Threshold must be a valid number');
        }

        if (threshold < 0) {
            throw new Error('Threshold cannot be negative');
        }

        return this.vehicleRepo.findLowStock(threshold);
    }
}
