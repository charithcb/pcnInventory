import { IInquiryRepository } from '../../../domain/repositories/IInquiryRepository';

export class GetMyInquiriesUseCase {
    constructor(private inquiryRepo: IInquiryRepository) {}

    async execute(customerId: string) {
        return this.inquiryRepo.findByCustomer(customerId);
    }
}
