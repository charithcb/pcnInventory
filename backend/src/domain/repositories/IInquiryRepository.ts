import { Inquiry } from '../entities/Inquiry';

export interface IInquiryRepository {
    create(data: Inquiry): Promise<Inquiry>;
    findById(id: string): Promise<Inquiry | null>;
    findByCustomer(customerId: string): Promise<Inquiry[]>;
    findAll(): Promise<Inquiry[]>;
    update(id: string, data: Partial<Inquiry>): Promise<Inquiry | null>;
}
