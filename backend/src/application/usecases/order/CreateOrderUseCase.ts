import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { Order } from "../../../domain/entities/Order";

export class CreateOrderUseCase {
    constructor(private orderRepo: IOrderRepository) {}

    async execute(orderData: Order): Promise<Order> {
        return this.orderRepo.create(orderData);
    }
}
