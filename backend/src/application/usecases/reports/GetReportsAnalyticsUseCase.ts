import { IReportsRepository } from "../../../domain/repositories/IReportsRepository";
import { ReportsAnalytics } from "../../../domain/entities/Reports";

export class GetReportsAnalyticsUseCase {
    constructor(private reportsRepo: IReportsRepository) {}

    async execute(): Promise<ReportsAnalytics> {
        return this.reportsRepo.getAnalytics();
    }
}
