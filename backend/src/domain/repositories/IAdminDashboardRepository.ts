import { AdminDashboardSummary } from "../entities/AdminDashboard";

export interface IAdminDashboardRepository {
    getSummary(): Promise<AdminDashboardSummary>;
}
