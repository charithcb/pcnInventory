import { Request, Response } from 'express';

import { MongoAppointmentRepository } from '../../infrastructure/database/repositories/MongoAppointmentRepository';

import { CreateAppointmentUseCase } from '../../application/usecases/appointment/CreateAppointmentUseCase';
import { GetMyAppointmentsUseCase } from '../../application/usecases/appointment/GetMyAppointmentsUseCase';
import { GetAllAppointmentsUseCase } from '../../application/usecases/appointment/GetAllAppointmentsUseCase';
import { UpdateAppointmentStatusUseCase } from '../../application/usecases/appointment/UpdateAppointmentStatusUseCase';

import { Appointment } from '../../domain/entities/Appointment';
import { logAudit } from '../../shared/services/auditLogger';

const repo = new MongoAppointmentRepository();

export class AppointmentController {

    static async create(req: Request, res: Response) {
        try {
            const useCase = new CreateAppointmentUseCase(repo);

            const appointment = await useCase.execute({
                customerId: req.user!.userId,
                type: req.body.type,
                date: req.body.date,
                time: req.body.time,
                notes: req.body.notes,
                status: 'PENDING'
            });

            await logAudit({
                action: 'APPOINTMENT_UPDATED',
                userId: req.user!.userId,
                entityType: 'APPOINTMENT',
                entityId: appointment.id,
                success: true,
                description: `Appointment ${appointment.id} created`,
                metadata: { status: appointment.status }
            });

            res.status(201).json(appointment);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getMyAppointments(req: Request, res: Response) {
        try {
            const useCase = new GetMyAppointmentsUseCase(repo);
            const list = await useCase.execute(req.user!.userId);
            res.json(list);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const useCase = new GetAllAppointmentsUseCase(repo);
            const list = await useCase.execute();
            res.json(list);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    static async updateStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const useCase = new UpdateAppointmentStatusUseCase(repo);

            const updated = await useCase.execute(
                id,
                status as Appointment['status'],   // Cast status to type-safe union
                req.user!.userId                  // Staff ID (who updated)
            );

            if (!updated) {
                return res.status(404).json({ message: 'Appointment not found' });
            }

            res.json(updated);

            await logAudit({
                action: 'APPOINTMENT_UPDATED',
                userId: req.user!.userId,
                entityType: 'APPOINTMENT',
                entityId: id,
                success: true,
                description: `Appointment ${id} status updated to ${status}`
            });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}

