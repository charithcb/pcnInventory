import { Request, Response } from 'express';
import { MongoOrderRepository } from '../../infrastructure/database/repositories/MongoOrderRepository';

import { CreateOrderUseCase } from '../../application/usecases/order/CreateOrderUseCase';
import { GetOrderByIdUseCase } from '../../application/usecases/order/GetOrderByIdUseCase';
import { GetOrdersByCustomerUseCase } from '../../application/usecases/order/GetOrdersByCustomerUseCase';
import { UpdateOrderStatusUseCase } from '../../application/usecases/order/UpdateOrderStatusUseCase';

const repo = new MongoOrderRepository();

export class OrderController {

    static async create(req: Request, res: Response) {
        const useCase = new CreateOrderUseCase(repo);
        const created = await useCase.execute({
            customerId: req.user.userId,
            vehicleId: req.body.vehicleId,
            notes: req.body.notes,
            status: 'PENDING'
        });
        res.status(201).json(created);
    }

    static async getById(req: Request, res: Response) {
        const useCase = new GetOrderByIdUseCase(repo);
        const order = await useCase.execute(req.params.id);
        res.json(order);
    }

    static async getCustomerOrders(req: Request, res: Response) {
        const useCase = new GetOrdersByCustomerUseCase(repo);
        const orders = await useCase.execute(req.user.userId);
        res.json(orders);
    }

    static async updateStatus(req: Request, res: Response) {
        const useCase = new UpdateOrderStatusUseCase(repo);
        const result = await useCase.execute(req.params.id, req.body.status);
        res.json(result);
    }
}
