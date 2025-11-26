import { IInquiryRepository } from '../../../domain/repositories/IInquiryRepository';
import { Inquiry } from '../../../domain/entities/Inquiry';
import { InquiryModel } from '../models/InquiryModel';

export class MongoInquiryRepository implements IInquiryRepository {
    async create(data: Inquiry): Promise<Inquiry> {
        const created = await InquiryModel.create(data);
        return created.toObject();
    }

    async findById(id: string): Promise<Inquiry | null> {
        const found = await InquiryModel.findById(id);
        return found ? found.toObject() : null;
    }

    async findByCustomer(customerId: string): Promise<Inquiry[]> {
        const list = await InquiryModel.find({ customerId });
        return list.map(i => i.toObject());
    }

    async findAll(): Promise<Inquiry[]> {
        const list = await InquiryModel.find();
        return list.map(i => i.toObject());
    }

    async update(id: string, data: Partial<Inquiry>): Promise<Inquiry | null> {
        const updated = await InquiryModel.findByIdAndUpdate(id, data, {
            new: true
        });
        return updated ? updated.toObject() : null;
    }
}
