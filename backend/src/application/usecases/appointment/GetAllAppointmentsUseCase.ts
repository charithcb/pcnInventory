import { IAppointmentRepository } from '../../../domain/repositories/IAppointmentRepository';

export class GetAllAppointmentsUseCase {
    constructor(private repo: IAppointmentRepository) {}

    async execute() {
        return this.repo.findAll();
    }
}
