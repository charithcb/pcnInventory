import { IVehicleRepository } from "../../../domain/repositories/IVehicleRepository";
import { Vehicle } from "../../../domain/entities/Vehicle";

export class UpdateVehicleAvailabilityUseCase {
    constructor(private vehicleRepo: IVehicleRepository) {}

    async execute(id: string, status: Vehicle['status'], staffId?: string): Promise<Vehicle | null> {
        if (!status) {
            throw new Error('Status is required');
        }

        const vehicle = await this.vehicleRepo.findById(id);
        if (!vehicle) {
            throw new Error('Vehicle not found');
        }

        const currentStatus = vehicle.status || 'AVAILABLE';
        const allowedTransitions: Record<string, Vehicle['status'][]> = {
            AVAILABLE: ['RESERVED', 'SOLD'],
            RESERVED: ['AVAILABLE', 'SOLD'],
            SOLD: [],
        };

        if (status === currentStatus) {
            return vehicle;
        }

        const canTransition = allowedTransitions[currentStatus]?.includes(status);
        if (!canTransition) {
            throw new Error(`Cannot change status from ${currentStatus} to ${status}`);
        }

        return this.vehicleRepo.update(id, { status, lastUpdatedBy: staffId });
    }
}
