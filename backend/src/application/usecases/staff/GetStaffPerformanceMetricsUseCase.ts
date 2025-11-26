import { IReportsRepository } from '../../../domain/repositories/IReportsRepository';
import { ReportsAnalytics, StaffMetric } from '../../../domain/entities/Reports';

interface StaffPerformanceResponse {
    inquiriesHandled: StaffMetric[];
    appointmentsCompleted: StaffMetric[];
    conversions: StaffMetric[];
}

export class GetStaffPerformanceMetricsUseCase {
    constructor(private reportsRepository: IReportsRepository) {}

    async execute(staffId?: string): Promise<StaffPerformanceResponse> {
        const analytics: ReportsAnalytics = await this.reportsRepository.getAnalytics();
        const performance = analytics.staffPerformance;

        if (!staffId) {
            return performance;
        }

        const filterByStaff = (metrics: StaffMetric[]) => metrics.filter((metric) => metric.staffId === staffId);

        return {
            inquiriesHandled: filterByStaff(performance.inquiriesHandled),
            appointmentsCompleted: filterByStaff(performance.appointmentsCompleted),
            conversions: filterByStaff(performance.conversions),
        };
    }
}
