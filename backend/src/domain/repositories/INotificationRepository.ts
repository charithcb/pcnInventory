import { Notification } from '../entities/Notification';

export interface INotificationRepository {
    create(data: Notification): Promise<Notification>;
    findByUser(userId: string): Promise<Notification[]>;
    markAsRead(id: string): Promise<Notification | null>;
}
