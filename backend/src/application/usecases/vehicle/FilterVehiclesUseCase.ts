import { IVehicleRepository } from "../../../domain/repositories/IVehicleRepository";

export class FilterVehiclesUseCase {
    constructor(private vehicleRepo: IVehicleRepository) {}

    async execute(filters: any) {
        return this.vehicleRepo.filter(filters);
    }
}
