import { IVehicleRepository } from "../../../domain/repositories/IVehicleRepository";

export class DeleteVehicleUseCase {
    constructor(private vehicleRepo: IVehicleRepository) {}

    async execute(id: string) {
        return this.vehicleRepo.delete(id);
    }
}
