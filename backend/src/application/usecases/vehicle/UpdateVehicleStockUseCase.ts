import { IVehicleRepository } from "../../../domain/repositories/IVehicleRepository";
import { Vehicle } from "../../../domain/entities/Vehicle";

export class UpdateVehicleStockUseCase {
    constructor(private vehicleRepo: IVehicleRepository) {}

    async execute(id: string, stock: number, staffId?: string): Promise<Vehicle | null> {
        if (!Number.isFinite(stock)) {
            throw new Error('Stock must be a valid number');
        }

        if (stock < 0) {
            throw new Error('Stock cannot be negative');
        }

        const vehicle = await this.vehicleRepo.findById(id);
        if (!vehicle) {
            throw new Error('Vehicle not found');
        }

        return this.vehicleRepo.update(id, { stock, lastUpdatedBy: staffId });
    }
}
