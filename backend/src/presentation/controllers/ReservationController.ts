import { Request, Response } from 'express';
import { MongoReservationRepository } from '../../infrastructure/database/repositories/MongoReservationRepository';

import { CreateReservationUseCase } from '../../application/usecases/reservation/CreateReservationUseCase';
import { GetReservationByIdUseCase } from '../../application/usecases/reservation/GetReservationByIdUseCase';
import { GetReservationsByCustomerUseCase } from '../../application/usecases/reservation/GetReservationsByCustomerUseCase';
import { GetAllReservationsUseCase } from '../../application/usecases/reservation/GetAllReservationsUseCase';
import { UpdateReservationStatusUseCase } from '../../application/usecases/reservation/UpdateReservationStatusUseCase';

const repo = new MongoReservationRepository();

export class ReservationController {
    static async create(req: Request, res: Response) {
        const useCase = new CreateReservationUseCase(repo);

        const reservation = await useCase.execute({
            customerId: req.user!.userId,
            vehicleId: req.body.vehicleId,
            notes: req.body.notes,
            status: 'PENDING'
        });

        res.status(201).json(reservation);
    }

    static async getMyReservations(req: Request, res: Response) {
        const useCase = new GetReservationsByCustomerUseCase(repo);
        const reservations = await useCase.execute(req.user!.userId);
        res.json(reservations);
    }

    static async getById(req: Request, res: Response) {
        const useCase = new GetReservationByIdUseCase(repo);
        const reservation = await useCase.execute(req.params.id);
        res.json(reservation);
    }

    static async getAll(req: Request, res: Response) {
        const useCase = new GetAllReservationsUseCase(repo);
        const reservations = await useCase.execute();
        res.json(reservations);
    }

    static async updateStatus(req: Request, res: Response) {
        const useCase = new UpdateReservationStatusUseCase(repo);
        const updated = await useCase.execute(req.params.id, req.body.status);
        res.json(updated);
    }
}
