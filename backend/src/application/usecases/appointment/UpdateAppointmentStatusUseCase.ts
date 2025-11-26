import { IAppointmentRepository } from '../../../domain/repositories/IAppointmentRepository';
import { Appointment } from '../../../domain/entities/Appointment';

export class UpdateAppointmentStatusUseCase {
    constructor(private repo: IAppointmentRepository) {}

    async execute(id: string, status: Appointment['status'], staffId: string) {
        // Validate allowed statuses
        const allowedStatuses: Appointment['status'][] = [
            'PENDING',
            'APPROVED',
            'REJECTED',
            'COMPLETED',
            'CANCELLED'
        ];

        if (!allowedStatuses.includes(status)) {
            throw new Error(`Invalid appointment status: ${status}`);
        }

        return this.repo.update(id, {
            status,
            staffId
        });
    }
}

