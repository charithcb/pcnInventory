import { IAppointmentRepository } from '../../../domain/repositories/IAppointmentRepository';

export class GetMyAppointmentsUseCase {
    constructor(private repo: IAppointmentRepository) {}

    async execute(customerId: string) {
        return this.repo.findByCustomer(customerId);
    }
}
