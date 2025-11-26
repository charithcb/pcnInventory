import { IVehicleRepository } from "../../../domain/repositories/IVehicleRepository";
import { Vehicle } from "../../../domain/entities/Vehicle";

export class UpdateVehicleUseCase {
    constructor(private vehicleRepo: IVehicleRepository) {}

    async execute(id: string, data: Partial<Vehicle>) {
        const sellingPrice = data.sellingPrice ?? data.price;
        const updateData: Partial<Vehicle> = {
            ...data,
            ...(sellingPrice !== undefined ? { sellingPrice, price: sellingPrice } : {}),
        };

        return this.vehicleRepo.update(id, updateData);
    }
}
