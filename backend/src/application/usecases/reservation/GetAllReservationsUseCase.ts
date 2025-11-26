import { IReservationRepository } from '../../../domain/repositories/IReservationRepository';

export class GetAllReservationsUseCase {
    constructor(private reservationRepo: IReservationRepository) {}

    async execute() {
        return this.reservationRepo.findAll();
    }
}
