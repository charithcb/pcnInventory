import { IInquiryRepository } from '../../../domain/repositories/IInquiryRepository';
import { INotificationRepository } from '../../../domain/repositories/INotificationRepository';

export class CloseInquiryUseCase {
    constructor(
        private inquiryRepo: IInquiryRepository,
        private notificationRepo: INotificationRepository
    ) {}

    async execute(inquiryId: string, closerId: string) {
        const updated = await this.inquiryRepo.update(inquiryId, {
            status: 'CLOSED'
        });

        if (updated) {
            const message = `Your inquiry "${updated.subject}" has been closed.`;
            console.log('[Notification]', message);

            await this.notificationRepo.create({
                userId: updated.customerId,
                message,
                type: 'INQUIRY_CLOSED',
                read: false
            });
        }

        return updated;
    }
}
