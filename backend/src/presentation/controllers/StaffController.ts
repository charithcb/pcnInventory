import { Request, Response } from 'express';

import { MongoUserRepository } from '../../infrastructure/database/repositories/MongoUserRepository';
import { MongoReportsRepository } from '../../infrastructure/database/repositories/MongoReportsRepository';
import { CreateStaffUseCase } from '../../application/usecases/staff/CreateStaffUseCase';
import { ListStaffUseCase } from '../../application/usecases/staff/ListStaffUseCase';
import { GetStaffMemberUseCase } from '../../application/usecases/staff/GetStaffMemberUseCase';
import { UpdateStaffRoleAndPermissionsUseCase } from '../../application/usecases/staff/UpdateStaffRoleAndPermissionsUseCase';
import { ToggleStaffStatusUseCase } from '../../application/usecases/staff/ToggleStaffStatusUseCase';
import { TrackStaffActivityUseCase } from '../../application/usecases/staff/TrackStaffActivityUseCase';
import { GetStaffActivityLogUseCase } from '../../application/usecases/staff/GetStaffActivityLogUseCase';
import { GetStaffPerformanceMetricsUseCase } from '../../application/usecases/staff/GetStaffPerformanceMetricsUseCase';

export class StaffController {
    static async create(req: Request, res: Response) {
        try {
            const repo = new MongoUserRepository();
            const useCase = new CreateStaffUseCase(repo);

            const staff = await useCase.execute(req.body);
            res.status(201).json(staff);
        } catch (error: any) {
            res.status(error.statusCode || 400).json({ message: error.message });
        }
    }

    static async list(req: Request, res: Response) {
        try {
            const repo = new MongoUserRepository();
            const useCase = new ListStaffUseCase(repo);

            const staff = await useCase.execute();
            res.json(staff);
        } catch (error: any) {
            res.status(error.statusCode || 400).json({ message: error.message });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const repo = new MongoUserRepository();
            const useCase = new GetStaffMemberUseCase(repo);

            const staff = await useCase.execute(req.params.id);
            res.json(staff);
        } catch (error: any) {
            res.status(error.statusCode || 400).json({ message: error.message });
        }
    }

    static async updateRoleAndPermissions(req: Request, res: Response) {
        try {
            const repo = new MongoUserRepository();
            const useCase = new UpdateStaffRoleAndPermissionsUseCase(repo);

            const updated = await useCase.execute({
                staffId: req.params.id,
                role: req.body.role,
                permissions: req.body.permissions,
            });

            res.json(updated);
        } catch (error: any) {
            res.status(error.statusCode || 400).json({ message: error.message });
        }
    }

    static async toggleStatus(req: Request, res: Response) {
        try {
            const repo = new MongoUserRepository();
            const useCase = new ToggleStaffStatusUseCase(repo);

            const updated = await useCase.execute({
                staffId: req.params.id,
                isActive: req.body.isActive,
            });

            res.json(updated);
        } catch (error: any) {
            res.status(error.statusCode || 400).json({ message: error.message });
        }
    }

    static async recordActivity(req: Request, res: Response) {
        try {
            const repo = new MongoUserRepository();
            const useCase = new TrackStaffActivityUseCase(repo);

            const updated = await useCase.execute({
                staffId: req.params.id,
                action: req.body.action,
                performedBy: req.user?.userId,
                details: req.body.details,
            });

            res.json(updated);
        } catch (error: any) {
            res.status(error.statusCode || 400).json({ message: error.message });
        }
    }

    static async getActivityLog(req: Request, res: Response) {
        try {
            const repo = new MongoUserRepository();
            const useCase = new GetStaffActivityLogUseCase(repo);

            const log = await useCase.execute(req.params.id);
            res.json(log);
        } catch (error: any) {
            res.status(error.statusCode || 400).json({ message: error.message });
        }
    }

    static async getPerformanceMetrics(req: Request, res: Response) {
        try {
            const reportsRepo = new MongoReportsRepository();
            const useCase = new GetStaffPerformanceMetricsUseCase(reportsRepo);

            const metrics = await useCase.execute(req.params.id);
            res.json(metrics);
        } catch (error: any) {
            res.status(error.statusCode || 400).json({ message: error.message });
        }
    }
}
