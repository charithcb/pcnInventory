export interface TopSellingModel {
    vehicleId: string;
    make: string;
    model: string;
    year?: number;
    sales: number;
}

export interface MonthlyMetric {
    month: string; // format: YYYY-MM
    value: number;
}

export interface VehicleMovementMetric {
    vehicleId: string;
    make: string;
    model: string;
    year?: number;
    metric: number;
    status?: string;
    ageDays?: number;
}

export interface StockAgeing {
    averageAgeDays: number;
    newestAgeDays: number;
    oldestAgeDays: number;
}

export interface StaffMetric {
    staffId: string;
    name?: string;
    count: number;
}

export interface ReportsAnalytics {
    sales: {
        totalVehicleSales: number;
        topSellingModels: TopSellingModel[];
        revenueByMonth: MonthlyMetric[];
    };
    orders: {
        pending: number;
        completed: number;
        cancelled: number;
    };
    inventory: {
        fastMovingVehicles: VehicleMovementMetric[];
        slowMovingVehicles: VehicleMovementMetric[];
        stockAgeing: StockAgeing;
    };
    customers: {
        newCustomersByMonth: MonthlyMetric[];
        retentionRate: number;
        repeatCustomers: number;
        totalCustomers: number;
    };
    staffPerformance: {
        inquiriesHandled: StaffMetric[];
        appointmentsCompleted: StaffMetric[];
        conversions: StaffMetric[];
    };
}
