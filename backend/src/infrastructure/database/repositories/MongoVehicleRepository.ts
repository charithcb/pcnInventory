import { IVehicleRepository } from "../../../domain/repositories/IVehicleRepository";
import { Vehicle } from "../../../domain/entities/Vehicle";
import { VehicleModel } from "../models/VehicleModel";

export class MongoVehicleRepository implements IVehicleRepository {

    async create(vehicle: Vehicle): Promise<Vehicle> {
        const created = await VehicleModel.create(vehicle);
        return created.toObject();
    }

    async findAll(): Promise<Vehicle[]> {
        const vehicles = await VehicleModel.find();
        return vehicles.map(v => v.toObject());
    }

    async findById(id: string): Promise<Vehicle | null> {
        const vehicle = await VehicleModel.findById(id);
        return vehicle ? vehicle.toObject() : null;
    }

    async update(id: string, data: Partial<Vehicle>): Promise<Vehicle | null> {
        const updated = await VehicleModel.findByIdAndUpdate(id, data, { new: true });
        return updated ? updated.toObject() : null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await VehicleModel.findByIdAndDelete(id);
        return result !== null;
    }

    async filter(query: any): Promise<Vehicle[]> {
        const vehicles = await VehicleModel.find(query);
        return vehicles.map(v => v.toObject());
    }

}
