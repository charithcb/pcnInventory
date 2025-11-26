import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { Order } from "../../../domain/entities/Order";

export class UpdateOrderStatusUseCase {
    constructor(private orderRepo: IOrderRepository) {}

    async execute(id: string, status: Order['status']) {
        return this.orderRepo.updateStatus(id, status);
    }
}
