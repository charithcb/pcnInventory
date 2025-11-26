import { IAppointmentRepository } from '../../../domain/repositories/IAppointmentRepository';
import { Appointment } from '../../../domain/entities/Appointment';

export class CreateAppointmentUseCase {
    constructor(private repo: IAppointmentRepository) {}

    async execute(data: Appointment): Promise<Appointment> {
        return this.repo.create(data);
    }
}
