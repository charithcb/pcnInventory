import { IReservationRepository } from '../../../domain/repositories/IReservationRepository';

export class GetReservationByIdUseCase {
    constructor(private reservationRepo: IReservationRepository) {}

    async execute(id: string) {
        return this.reservationRepo.findById(id);
    }
}
