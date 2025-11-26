import { IVehicleRepository } from "../../../domain/repositories/IVehicleRepository";

export class GetVehicleByIdUseCase {
    constructor(private vehicleRepo: IVehicleRepository) {}

    async execute(id: string) {
        return this.vehicleRepo.findById(id);
    }
}
