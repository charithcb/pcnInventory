import { Request, Response } from 'express';
import { MongoOrderRepository } from '../../infrastructure/database/repositories/MongoOrderRepository';

import { CreateOrderUseCase } from '../../application/usecases/order/CreateOrderUseCase';
import { GetOrderByIdUseCase } from '../../application/usecases/order/GetOrderByIdUseCase';
import { GetOrdersByCustomerUseCase } from '../../application/usecases/order/GetOrdersByCustomerUseCase';
import { UpdateOrderStatusUseCase } from '../../application/usecases/order/UpdateOrderStatusUseCase';
import { logAudit } from '../../shared/services/auditLogger';

const repo = new MongoOrderRepository();

export class OrderController {

    static async create(req: Request, res: Response) {
        try {
            const useCase = new CreateOrderUseCase(repo);
            const created = await useCase.execute({
                customerId: req.user!.userId,
                vehicleId: req.body.vehicleId,
                notes: req.body.notes,
                status: 'PENDING'
            });

            await logAudit({
                action: 'ORDER_UPDATED',
                userId: req.user!.userId,
                entityType: 'ORDER',
                entityId: created.id,
                success: true,
                description: `Order ${created.id} created`,
                metadata: { vehicleId: created.vehicleId }
            });

            res.status(201).json(created);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getById(req: Request, res: Response) {
        const useCase = new GetOrderByIdUseCase(repo);
        const order = await useCase.execute(req.params.id);
        res.json(order);
    }

    static async getCustomerOrders(req: Request, res: Response) {
        const useCase = new GetOrdersByCustomerUseCase(repo);
        const orders = await useCase.execute(req.user!.userId);
        res.json(orders);
    }

    static async updateStatus(req: Request, res: Response) {
        try {
            const useCase = new UpdateOrderStatusUseCase(repo);
            const result = await useCase.execute(req.params.id, req.body.status);
            res.json(result);

            await logAudit({
                action: 'ORDER_UPDATED',
                userId: req.user!.userId,
                entityType: 'ORDER',
                entityId: req.params.id,
                success: true,
                description: `Order ${req.params.id} status changed to ${req.body.status}`
            });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
