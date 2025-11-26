import { IAdminDashboardRepository } from "../../../domain/repositories/IAdminDashboardRepository";

export class GetAdminDashboardMetricsUseCase {
    constructor(private repo: IAdminDashboardRepository) {}

    async execute() {
        return this.repo.getMetrics();
    }
}
