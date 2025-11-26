import { IAdminDashboardRepository } from "../../../domain/repositories/IAdminDashboardRepository";
import { AdminDashboardMetrics } from "../../../domain/entities/AdminDashboard";
import { UserModel } from "../models/UserModel";
import { VehicleModel } from "../models/VehicleModel";
import { OrderModel } from "../models/OrderModel";
import { ReservationModel } from "../models/ReservationModel";
import { InquiryModel } from "../models/InquiryModel";
import { InvoiceModel } from "../models/InvoiceModel";

export class MongoAdminDashboardRepository implements IAdminDashboardRepository {
    async getMetrics(): Promise<AdminDashboardMetrics> {
        const [
            totalUsers,
            totalVehicles,
            availableVehicles,
            totalOrders,
            pendingOrders,
            completedOrders,
            totalReservations,
            pendingReservations,
            totalInquiries,
            openInquiries,
            totalInvoices,
            unpaidInvoices,
            paidInvoices
        ] = await Promise.all([
            UserModel.countDocuments(),
            VehicleModel.countDocuments(),
            VehicleModel.countDocuments({ status: "AVAILABLE" }),
            OrderModel.countDocuments(),
            OrderModel.countDocuments({ status: "PENDING" }),
            OrderModel.countDocuments({ status: "COMPLETED" }),
            ReservationModel.countDocuments(),
            ReservationModel.countDocuments({ status: "PENDING" }),
            InquiryModel.countDocuments(),
            InquiryModel.countDocuments({ status: "OPEN" }),
            InvoiceModel.countDocuments(),
            InvoiceModel.countDocuments({ status: "PENDING" }),
            InvoiceModel.countDocuments({ status: "PAID" }),
        ]);

        const revenueAgg = await InvoiceModel.aggregate([
            { $match: { status: "PAID" } },
            { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
        ]);

        const recentOrdersDocs = await OrderModel.find()
            .sort({ createdAt: -1 })
            .limit(5);
        const recentInquiriesDocs = await InquiryModel.find()
            .sort({ createdAt: -1 })
            .limit(5);

        return {
            totalUsers,
            totalVehicles,
            availableVehicles,
            totalOrders,
            pendingOrders,
            completedOrders,
            totalReservations,
            pendingReservations,
            totalInquiries,
            openInquiries,
            totalInvoices,
            unpaidInvoices,
            paidInvoices,
            totalRevenue: revenueAgg[0]?.totalRevenue || 0,
            recentOrders: recentOrdersDocs.map((o) => o.toObject()),
            recentInquiries: recentInquiriesDocs.map((i) => i.toObject()),
        };
    }
}
