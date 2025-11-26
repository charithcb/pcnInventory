import { Order } from "../entities/Order";

export interface IOrderRepository {
    create(order: Order): Promise<Order>;
    findById(id: string): Promise<Order | null>;
    findByCustomer(customerId: string): Promise<Order[]>;
    findAll(): Promise<Order[]>;
    updateStatus(id: string, status: Order['status']): Promise<Order | null>;
}
