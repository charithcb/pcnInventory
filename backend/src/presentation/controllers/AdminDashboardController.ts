import { Request, Response } from "express";
import { MongoAdminDashboardRepository } from "../../infrastructure/database/repositories/MongoAdminDashboardRepository";
import { GetAdminDashboardSummaryUseCase } from "../../application/usecases/dashboard/GetAdminDashboardSummaryUseCase";

const dashboardRepo = new MongoAdminDashboardRepository();

export class AdminDashboardController {
    static async getSummary(req: Request, res: Response) {
        try {
            const useCase = new GetAdminDashboardSummaryUseCase(dashboardRepo);
            const summary = await useCase.execute();
            res.json(summary);
        } catch (error) {
            res.status(500).json({ error: "Failed to load dashboard data" });
        }
    }
}
