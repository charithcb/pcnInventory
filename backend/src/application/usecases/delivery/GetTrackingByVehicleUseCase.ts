import { IDeliveryTrackingRepository } from "../../../domain/repositories/IDeliveryTrackingRepository";

export class GetTrackingByVehicleUseCase {
    constructor(private repo: IDeliveryTrackingRepository) {}

    async execute(vehicleId: string) {
        return this.repo.findByVehicle(vehicleId);
    }
}
