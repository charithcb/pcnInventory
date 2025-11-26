import { IInquiryRepository } from '../../../domain/repositories/IInquiryRepository';
import { INotificationRepository } from '../../../domain/repositories/INotificationRepository';
import { Inquiry } from '../../../domain/entities/Inquiry';

export class CreateInquiryUseCase {
    constructor(
        private inquiryRepo: IInquiryRepository,
        private notificationRepo: INotificationRepository
    ) {}

    async execute(data: Inquiry): Promise<Inquiry> {
        const created = await this.inquiryRepo.create(data);

        // Notify staff/admin (for now, just send to the same customer to keep it simple)
        const message = `New inquiry created: ${created.subject}`;
        console.log('[Notification]', message);

        await this.notificationRepo.create({
            userId: created.customerId,
            message,
            type: 'INQUIRY_CREATED',
            read: false
        });

        return created;
    }
}
