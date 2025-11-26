import { Request, Response } from "express";
import { MongoReportsRepository } from "../../infrastructure/database/repositories/MongoReportsRepository";
import { GetReportsAnalyticsUseCase } from "../../application/usecases/reports/GetReportsAnalyticsUseCase";

const reportsRepository = new MongoReportsRepository();

export class ReportsController {
    static async getAnalytics(req: Request, res: Response) {
        try {
            const useCase = new GetReportsAnalyticsUseCase(reportsRepository);
            const analytics = await useCase.execute();
            res.json(analytics);
        } catch (error) {
            res.status(500).json({ error: "Failed to load reports & analytics" });
        }
    }
}
