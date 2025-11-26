import { IDeliveryTrackingRepository } from "../../../domain/repositories/IDeliveryTrackingRepository";
import { DeliveryTracking } from "../../../domain/entities/DeliveryTracking";

export class CreateDeliveryTrackingUseCase {
    constructor(private repo: IDeliveryTrackingRepository) {}

    async execute(data: DeliveryTracking) {
        return this.repo.create(data);
    }
}
