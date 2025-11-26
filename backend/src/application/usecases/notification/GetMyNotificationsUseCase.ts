import { INotificationRepository } from '../../../domain/repositories/INotificationRepository';

export class GetMyNotificationsUseCase {
    constructor(private notificationRepo: INotificationRepository) {}

    async execute(userId: string) {
        return this.notificationRepo.findByUser(userId);
    }
}
