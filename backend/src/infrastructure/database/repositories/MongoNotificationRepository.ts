import { INotificationRepository } from '../../../domain/repositories/INotificationRepository';
import { Notification } from '../../../domain/entities/Notification';
import { NotificationModel } from '../models/NotificationModel';

export class MongoNotificationRepository implements INotificationRepository {
    async create(data: Notification): Promise<Notification> {
        const created = await NotificationModel.create(data);
        return created.toObject();
    }

    async findByUser(userId: string): Promise<Notification[]> {
        const list = await NotificationModel.find({ userId }).sort({
            createdAt: -1
        });
        return list.map(n => n.toObject());
    }

    async markAsRead(id: string): Promise<Notification | null> {
        const updated = await NotificationModel.findByIdAndUpdate(
            id,
            { read: true },
            { new: true }
        );
        return updated ? updated.toObject() : null;
    }
}
