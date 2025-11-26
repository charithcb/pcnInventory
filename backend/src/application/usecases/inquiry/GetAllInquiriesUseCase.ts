import { IInquiryRepository } from '../../../domain/repositories/IInquiryRepository';

export class GetAllInquiriesUseCase {
    constructor(private inquiryRepo: IInquiryRepository) {}

    async execute() {
        return this.inquiryRepo.findAll();
    }
}
