import { Vehicle } from "../../../domain/entities/Vehicle";
import { IVehicleRepository } from "../../../domain/repositories/IVehicleRepository";

export class CreateVehicleUseCase {
    constructor(private vehicleRepo: IVehicleRepository) {}

    async execute(data: Vehicle): Promise<Vehicle> {
        return this.vehicleRepo.create(data);
    }
}
