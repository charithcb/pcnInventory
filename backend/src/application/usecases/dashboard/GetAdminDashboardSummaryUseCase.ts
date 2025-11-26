import { IAdminDashboardRepository } from "../../../domain/repositories/IAdminDashboardRepository";

export class GetAdminDashboardSummaryUseCase {
    constructor(private dashboardRepo: IAdminDashboardRepository) {}

    async execute() {
        return this.dashboardRepo.getSummary();
    }
}
