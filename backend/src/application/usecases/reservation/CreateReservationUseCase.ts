import { IReservationRepository } from '../../../domain/repositories/IReservationRepository';
import { Reservation } from '../../../domain/entities/Reservation';

export class CreateReservationUseCase {
    constructor(private reservationRepo: IReservationRepository) {}

    async execute(data: Reservation): Promise<Reservation> {
        // Here you could also check if vehicle is AVAILABLE, etc.
        return this.reservationRepo.create(data);
    }
}
