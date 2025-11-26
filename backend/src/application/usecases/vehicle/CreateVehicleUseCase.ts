import { Vehicle } from "../../../domain/entities/Vehicle";
import { IVehicleRepository } from "../../../domain/repositories/IVehicleRepository";

export class CreateVehicleUseCase {
    constructor(private vehicleRepo: IVehicleRepository) {}

    async execute(data: Vehicle): Promise<Vehicle> {
        const sellingPrice = data.sellingPrice ?? data.price;
        const vehicleData: Vehicle = {
            ...data,
            sellingPrice,
            price: sellingPrice,
            stock: data.stock ?? 0,
            status: data.status ?? 'AVAILABLE',
        };

        return this.vehicleRepo.create(vehicleData);
    }
}
