import { INotificationRepository } from '../../../domain/repositories/INotificationRepository';

export class MarkNotificationReadUseCase {
    constructor(private notificationRepo: INotificationRepository) {}

    async execute(id: string) {
        return this.notificationRepo.markAsRead(id);
    }
}
