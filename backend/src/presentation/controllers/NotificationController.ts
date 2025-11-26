import { Request, Response } from 'express';
import { MongoNotificationRepository } from '../../infrastructure/database/repositories/MongoNotificationRepository';
import { GetMyNotificationsUseCase } from '../../application/usecases/notification/GetMyNotificationsUseCase';
import { MarkNotificationReadUseCase } from '../../application/usecases/notification/MarkNotificationReadUseCase';

const notificationRepo = new MongoNotificationRepository();

export class NotificationController {
    static async getMyNotifications(req: Request, res: Response) {
        const useCase = new GetMyNotificationsUseCase(notificationRepo);
        const list = await useCase.execute(req.user.userId);
        res.json(list);
    }

    static async markRead(req: Request, res: Response) {
        const useCase = new MarkNotificationReadUseCase(notificationRepo);
        const updated = await useCase.execute(req.params.id);
        res.json(updated);
    }
}
