import { AdminDashboardMetrics } from "../entities/AdminDashboard";

export interface IAdminDashboardRepository {
    getMetrics(): Promise<AdminDashboardMetrics>;
}
