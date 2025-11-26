import { DeliveryTracking } from "../entities/DeliveryTracking";

export interface IDeliveryTrackingRepository {
    create(data: DeliveryTracking): Promise<DeliveryTracking>;
    findByOrder(orderId: string): Promise<DeliveryTracking | null>;
    findByVehicle(vehicleId: string): Promise<DeliveryTracking | null>;
    findByCustomer(customerId: string): Promise<DeliveryTracking[]>;
    findAll(): Promise<DeliveryTracking[]>;
    update(id: string, data: Partial<DeliveryTracking>): Promise<DeliveryTracking | null>;
}
