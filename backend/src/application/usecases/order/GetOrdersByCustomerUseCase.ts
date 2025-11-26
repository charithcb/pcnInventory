import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";

export class GetOrdersByCustomerUseCase {
    constructor(private orderRepo: IOrderRepository) {}

    async execute(customerId: string) {
        return this.orderRepo.findByCustomer(customerId);
    }
}
