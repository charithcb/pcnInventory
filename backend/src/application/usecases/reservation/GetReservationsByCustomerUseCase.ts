import { IReservationRepository } from '../../../domain/repositories/IReservationRepository';

export class GetReservationsByCustomerUseCase {
    constructor(private reservationRepo: IReservationRepository) {}

    async execute(customerId: string) {
        return this.reservationRepo.findByCustomer(customerId);
    }
}