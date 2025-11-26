import { Reservation } from '../entities/Reservation';

export interface IReservationRepository {
    create(data: Reservation): Promise<Reservation>;
    findById(id: string): Promise<Reservation | null>;
    findByCustomer(customerId: string): Promise<Reservation[]>;
    findAll(): Promise<Reservation[]>;
    updateStatus(id: string, status: Reservation['status']): Promise<Reservation | null>;
}
