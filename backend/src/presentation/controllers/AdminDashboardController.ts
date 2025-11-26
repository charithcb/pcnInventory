import { Request, Response } from "express";
import { MongoAdminDashboardRepository } from "../../infrastructure/database/repositories/MongoAdminDashboardRepository";
import { GetAdminDashboardMetricsUseCase } from "../../application/usecases/adminDashboard/GetAdminDashboardMetricsUseCase";

const repo = new MongoAdminDashboardRepository();

export class AdminDashboardController {
    static async getMetrics(req: Request, res: Response) {
        try {
            const useCase = new GetAdminDashboardMetricsUseCase(repo);
            const metrics = await useCase.execute();
            res.json(metrics);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }
}
