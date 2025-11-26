import { IReservationRepository } from '../../../domain/repositories/IReservationRepository';
import { Reservation } from '../../../domain/entities/Reservation';
import { ReservationModel } from '../models/ReservationModel';

export class MongoReservationRepository implements IReservationRepository {
    async create(data: Reservation): Promise<Reservation> {
        const created = await ReservationModel.create(data);
        return created.toObject();
    }

    async findById(id: string): Promise<Reservation | null> {
        const res = await ReservationModel.findById(id);
        return res ? res.toObject() : null;
    }

    async findByCustomer(customerId: string): Promise<Reservation[]> {
        const results = await ReservationModel.find({ customerId });
        return results.map(r => r.toObject());
    }

    async findAll(): Promise<Reservation[]> {
        const results = await ReservationModel.find();
        return results.map(r => r.toObject());
    }

    async updateStatus(id: string, status: Reservation['status']): Promise<Reservation | null> {
        const updated = await ReservationModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        return updated ? updated.toObject() : null;
    }
}
