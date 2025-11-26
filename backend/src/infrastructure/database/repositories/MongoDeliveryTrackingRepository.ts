import { IDeliveryTrackingRepository } from "../../../domain/repositories/IDeliveryTrackingRepository";
import { DeliveryTracking } from "../../../domain/entities/DeliveryTracking";
import { DeliveryTrackingModel } from "../models/DeliveryTrackingModel";

export class MongoDeliveryTrackingRepository implements IDeliveryTrackingRepository {
    async create(data: DeliveryTracking): Promise<DeliveryTracking> {
        const created = await DeliveryTrackingModel.create(data);
        return created.toObject();
    }

    async findByOrder(orderId: string): Promise<DeliveryTracking | null> {
        const found = await DeliveryTrackingModel.findOne({ orderId });
        return found ? found.toObject() : null;
    }

    async findByCustomer(customerId: string): Promise<DeliveryTracking[]> {
        const list = await DeliveryTrackingModel.find({ customerId });
        return list.map(i => i.toObject());
    }

    async findAll(): Promise<DeliveryTracking[]> {
        const list = await DeliveryTrackingModel.find();
        return list.map(i => i.toObject());
    }

    async update(id: string, data: Partial<DeliveryTracking>): Promise<DeliveryTracking | null> {
        const updated = await DeliveryTrackingModel.findByIdAndUpdate(id, data, { new: true });
        return updated ? updated.toObject() : null;
    }
}
