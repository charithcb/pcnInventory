import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { Order } from "../../../domain/entities/Order";
import { OrderModel } from "../models/OrderModel";

export class MongoOrderRepository implements IOrderRepository {

    async create(order: Order): Promise<Order> {
        const created = await OrderModel.create(order);
        return created.toObject();
    }

    async findById(id: string): Promise<Order | null> {
        const order = await OrderModel.findById(id);
        return order ? order.toObject() : null;
    }

    async findByCustomer(customerId: string): Promise<Order[]> {
        const orders = await OrderModel.find({ customerId });
        return orders.map(o => o.toObject());
    }

    async findAll(): Promise<Order[]> {
        const orders = await OrderModel.find();
        return orders.map(o => o.toObject());
    }

    async updateStatus(id: string, status: Order['status']): Promise<Order | null> {
        const updated = await OrderModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        return updated ? updated.toObject() : null;
    }
}
