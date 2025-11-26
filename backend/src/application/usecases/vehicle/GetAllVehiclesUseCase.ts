import { IVehicleRepository } from "../../../domain/repositories/IVehicleRepository";

export class GetAllVehiclesUseCase {
    constructor(private vehicleRepo: IVehicleRepository) {}

    async execute() {
        return this.vehicleRepo.findAll();
    }
}
