import { IVehicleRepository } from "../../../domain/repositories/IVehicleRepository";
import { Vehicle } from "../../../domain/entities/Vehicle";

export class UpdateVehicleUseCase {
    constructor(private vehicleRepo: IVehicleRepository) {}

    async execute(id: string, data: Partial<Vehicle>) {
        return this.vehicleRepo.update(id, data);
    }
}
