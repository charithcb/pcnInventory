import { IDeliveryTrackingRepository } from "../../../domain/repositories/IDeliveryTrackingRepository";

export class GetTrackingForCustomerUseCase {
    constructor(private repo: IDeliveryTrackingRepository) {}

    async execute(customerId: string) {
        return this.repo.findByCustomer(customerId);
    }
}
