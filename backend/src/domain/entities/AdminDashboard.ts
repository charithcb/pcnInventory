export interface AdminDashboardSummary {
    totalUsers: number;
    totalCustomers: number;
    totalVehicles: number;
    availableVehicles: number;
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    completedOrders: number;
    pendingInvoices: number;
    paidInvoices: number;
    totalRevenue: number;
    openInquiries: number;
    pendingAppointments: number;
}
