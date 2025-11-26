import { IInquiryRepository } from '../../../domain/repositories/IInquiryRepository';
import { INotificationRepository } from '../../../domain/repositories/INotificationRepository';

export class ReplyInquiryUseCase {
    constructor(
        private inquiryRepo: IInquiryRepository,
        private notificationRepo: INotificationRepository
    ) {}

    async execute(
        inquiryId: string,
        staffId: string,
        replyMessage: string
    ) {
        const updated = await this.inquiryRepo.update(inquiryId, {
            staffId,
            staffReply: replyMessage,
            status: 'ANSWERED'
        });

        if (updated) {
            const message = `Your inquiry "${updated.subject}" has been answered.`;
            console.log('[Notification]', message);

            await this.notificationRepo.create({
                userId: updated.customerId,
                message,
                type: 'INQUIRY_REPLIED',
                read: false
            });
        }

        return updated;
    }
}
