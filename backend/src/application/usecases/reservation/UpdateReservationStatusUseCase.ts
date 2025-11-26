import { IReservationRepository } from '../../../domain/repositories/IReservationRepository';
import { Reservation } from '../../../domain/entities/Reservation';

export class UpdateReservationStatusUseCase {
    constructor(private reservationRepo: IReservationRepository) {}

    async execute(id: string, status: Reservation['status']) {
        return this.reservationRepo.updateStatus(id, status);
    }
}
