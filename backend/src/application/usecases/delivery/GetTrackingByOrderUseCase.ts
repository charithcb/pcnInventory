import { IDeliveryTrackingRepository } from "../../../domain/repositories/IDeliveryTrackingRepository";

export class GetTrackingByOrderUseCase {
    constructor(private repo: IDeliveryTrackingRepository) {}

    async execute(orderId: string) {
        return this.repo.findByOrder(orderId);
    }
}
