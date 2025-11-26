import { IAdminDashboardRepository } from "../../../domain/repositories/IAdminDashboardRepository";
import { AdminDashboardSummary } from "../../../domain/entities/AdminDashboard";
import { UserModel } from "../models/UserModel";
import { VehicleModel } from "../models/VehicleModel";
import { OrderModel } from "../models/OrderModel";
import { InvoiceModel } from "../models/InvoiceModel";
import { InquiryModel } from "../models/InquiryModel";
import { AppointmentModel } from "../models/AppointmentModel";

export class MongoAdminDashboardRepository implements IAdminDashboardRepository {
    async getSummary(): Promise<AdminDashboardSummary> {
        const [
            totalUsers,
            totalCustomers,
            totalVehicles,
            availableVehicles,
            totalOrders,
            pendingOrders,
            processingOrders,
            completedOrders,
            pendingInvoices,
            paidInvoices,
            revenueResult,
            openInquiries,
            pendingAppointments
        ] = await Promise.all([
            UserModel.countDocuments(),
            UserModel.countDocuments({ role: "CUSTOMER" }),
            VehicleModel.countDocuments(),
            VehicleModel.countDocuments({ status: "AVAILABLE" }),
            OrderModel.countDocuments(),
            OrderModel.countDocuments({ status: "PENDING" }),
            OrderModel.countDocuments({ status: "PROCESSING" }),
            OrderModel.countDocuments({ status: "COMPLETED" }),
            InvoiceModel.countDocuments({ status: "PENDING" }),
            InvoiceModel.countDocuments({ status: "PAID" }),
            InvoiceModel.aggregate([
                { $match: { status: "PAID" } },
                { $group: { _id: null, total: { $sum: "$total" } } }
            ]),
            InquiryModel.countDocuments({ status: "OPEN" }),
            AppointmentModel.countDocuments({ status: "PENDING" })
        ]);

        const totalRevenue =
            Array.isArray(revenueResult) && revenueResult.length > 0
                ? revenueResult[0].total
                : 0;

        return {
            totalUsers,
            totalCustomers,
            totalVehicles,
            availableVehicles,
            totalOrders,
            pendingOrders,
            processingOrders,
            completedOrders,
            pendingInvoices,
            paidInvoices,
            totalRevenue,
            openInquiries,
            pendingAppointments
        };
    }
}
