import { Inquiry } from "./Inquiry";
import { Order } from "./Order";

export interface AdminDashboardMetrics {
    totalUsers: number;
    totalVehicles: number;
    availableVehicles: number;
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalReservations: number;
    pendingReservations: number;
    totalInquiries: number;
    openInquiries: number;
    totalInvoices: number;
    unpaidInvoices: number;
    paidInvoices: number;
    totalRevenue: number;
    recentOrders: Order[];
    recentInquiries: Inquiry[];
}
