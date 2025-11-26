import { Appointment } from '../entities/Appointment';

export interface IAppointmentRepository {
    create(data: Appointment): Promise<Appointment>;
    findByCustomer(customerId: string): Promise<Appointment[]>;
    findAll(): Promise<Appointment[]>;
    update(id: string, data: Partial<Appointment>): Promise<Appointment | null>;
    findById(id: string): Promise<Appointment | null>;
}
