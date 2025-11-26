import { IAppointmentRepository } from '../../../domain/repositories/IAppointmentRepository';
import { Appointment } from '../../../domain/entities/Appointment';
import { AppointmentModel } from '../models/AppointmentModel';

export class MongoAppointmentRepository implements IAppointmentRepository {
    async create(data: Appointment): Promise<Appointment> {
        const created = await AppointmentModel.create(data);
        return created.toObject();
    }

    async findByCustomer(customerId: string): Promise<Appointment[]> {
        const list = await AppointmentModel.find({ customerId });
        return list.map(a => a.toObject());
    }

    async findAll(): Promise<Appointment[]> {
        const list = await AppointmentModel.find();
        return list.map(a => a.toObject());
    }

    async findById(id: string): Promise<Appointment | null> {
        const found = await AppointmentModel.findById(id);
        return found ? found.toObject() : null;
    }

    async update(id: string, data: Partial<Appointment>): Promise<Appointment | null> {
        const updated = await AppointmentModel.findByIdAndUpdate(id, data, { new: true });
        return updated ? updated.toObject() : null;
    }
}
