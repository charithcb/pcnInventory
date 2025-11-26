import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";

export class GetOrderByIdUseCase {
    constructor(private orderRepo: IOrderRepository) {}

    async execute(id: string) {
        return this.orderRepo.findById(id);
    }
}
