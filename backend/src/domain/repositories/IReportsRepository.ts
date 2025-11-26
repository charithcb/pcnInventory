import { ReportsAnalytics } from "../entities/Reports";

export interface IReportsRepository {
    getAnalytics(): Promise<ReportsAnalytics>;
}
