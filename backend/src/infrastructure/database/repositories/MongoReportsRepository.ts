import { Types } from "mongoose";
import { IReportsRepository } from "../../../domain/repositories/IReportsRepository";
import { ReportsAnalytics, StaffMetric, VehicleMovementMetric } from "../../../domain/entities/Reports";
import { OrderModel } from "../models/OrderModel";
import { VehicleModel } from "../models/VehicleModel";
import { InvoiceModel } from "../models/InvoiceModel";
import { UserModel } from "../models/UserModel";
import { InquiryModel } from "../models/InquiryModel";
import { AppointmentModel } from "../models/AppointmentModel";

export class MongoReportsRepository implements IReportsRepository {
    async getAnalytics(): Promise<ReportsAnalytics> {
        const [
            totalVehicleSales,
            topSellingModels,
            revenueByMonth,
            orders,
            fastMovingVehicles,
            slowMovingVehicles,
            stockAgeing,
            newCustomersByMonth,
            customerTotals,
            staffInquiries,
            staffAppointments,
            staffConversions
        ] = await Promise.all([
            this.getTotalVehicleSales(),
            this.getTopSellingModels(),
            this.getRevenueByMonth(),
            this.getOrderBreakdown(),
            this.getFastMovingVehicles(),
            this.getSlowMovingVehicles(),
            this.getStockAgeing(),
            this.getNewCustomersByMonth(),
            this.getCustomerTotals(),
            this.getStaffInquiriesHandled(),
            this.getStaffAppointmentsCompleted(),
            this.getStaffConversions()
        ]);

        const retentionRate =
            customerTotals.totalCustomers > 0
                ? Number(
                    ((customerTotals.repeatCustomers / customerTotals.totalCustomers) * 100).toFixed(2)
                )
                : 0;

        const staffIds = [
            ...staffInquiries.map((item) => item.staffId),
            ...staffAppointments.map((item) => item.staffId),
            ...staffConversions.map((item) => item.staffId)
        ];

        const uniqueStaffIds = Array.from(new Set(staffIds));
        const staffMap = await this.getStaffMap(uniqueStaffIds);

        const mapMetricsToStaff = (metrics: StaffMetric[]): StaffMetric[] =>
            metrics.map((metric) => ({
                ...metric,
                name: staffMap.get(metric.staffId)
            }));

        return {
            sales: {
                totalVehicleSales,
                topSellingModels,
                revenueByMonth
            },
            orders,
            inventory: {
                fastMovingVehicles,
                slowMovingVehicles,
                stockAgeing
            },
            customers: {
                newCustomersByMonth,
                retentionRate,
                repeatCustomers: customerTotals.repeatCustomers,
                totalCustomers: customerTotals.totalCustomers
            },
            staffPerformance: {
                inquiriesHandled: mapMetricsToStaff(staffInquiries),
                appointmentsCompleted: mapMetricsToStaff(staffAppointments),
                conversions: mapMetricsToStaff(staffConversions)
            }
        };
    }

    private async getTotalVehicleSales(): Promise<number> {
        return OrderModel.countDocuments({ status: "COMPLETED" });
    }

    private async getTopSellingModels() {
        const salesByVehicle = await OrderModel.aggregate<{
            _id: string;
            sales: number;
        }>([
            { $match: { status: "COMPLETED" } },
            { $group: { _id: "$vehicleId", sales: { $sum: 1 } } },
            { $sort: { sales: -1 } },
            { $limit: 5 }
        ]);

        const vehicleIds = salesByVehicle
            .map((entry) => entry._id)
            .filter((id) => Types.ObjectId.isValid(id))
            .map((id) => new Types.ObjectId(id));
        const vehicles = await VehicleModel.find({ _id: { $in: vehicleIds } });
        const vehicleMap = new Map(vehicles.map((vehicle) => [vehicle._id.toString(), vehicle]));

        return salesByVehicle.map((entry) => {
            const vehicle = vehicleMap.get(entry._id);
            return {
                vehicleId: entry._id,
                make: vehicle?.make ?? "Unknown",
                model: vehicle?.model ?? "Unknown",
                year: vehicle?.year,
                sales: entry.sales
            };
        });
    }

    private async getRevenueByMonth() {
        const revenue = await InvoiceModel.aggregate<{
            _id: { year: number; month: number };
            revenue: number;
        }>([
            { $match: { status: "PAID" } },
            {
                $group: {
                    _id: { year: { $year: "$issuedAt" }, month: { $month: "$issuedAt" } },
                    revenue: { $sum: "$total" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        return revenue.map((entry) => ({
            month: `${entry._id.year}-${entry._id.month.toString().padStart(2, "0")}`,
            value: entry.revenue
        }));
    }

    private async getOrderBreakdown() {
        const [pending, completed, rejected] = await Promise.all([
            OrderModel.countDocuments({ status: "PENDING" }),
            OrderModel.countDocuments({ status: "COMPLETED" }),
            OrderModel.countDocuments({ status: "REJECTED" })
        ]);

        return {
            pending,
            completed,
            cancelled: rejected
        };
    }

    private async getFastMovingVehicles(): Promise<VehicleMovementMetric[]> {
        const topSales = await OrderModel.aggregate<{
            _id: string;
            metric: number;
        }>([
            { $match: { status: "COMPLETED" } },
            { $group: { _id: "$vehicleId", metric: { $sum: 1 } } },
            { $sort: { metric: -1 } },
            { $limit: 5 }
        ]);

        return this.enrichVehiclesWithMetric(topSales);
    }

    private async getSlowMovingVehicles(): Promise<VehicleMovementMetric[]> {
        const slowVehicles = await VehicleModel.find({ status: "AVAILABLE" })
            .sort({ createdAt: 1 })
            .limit(5);

        return slowVehicles.map((vehicle) => {
            const ageDays = this.calculateAgeInDays(vehicle.createdAt ?? new Date());
            return {
                vehicleId: vehicle._id.toString(),
                make: vehicle.make,
                model: vehicle.model,
                year: vehicle.year,
                status: vehicle.status,
                metric: ageDays,
                ageDays
            };
        });
    }

    private async getStockAgeing() {
        const [result] = await VehicleModel.aggregate<{
            _id: null;
            averageAgeDays: number;
            oldestAgeDays: number;
            newestAgeDays: number;
        }>([
            { $match: { status: "AVAILABLE" } },
            {
                $project: {
                    ageDays: {
                        $divide: [{ $subtract: [new Date(), "$createdAt"] }, 1000 * 60 * 60 * 24]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    averageAgeDays: { $avg: "$ageDays" },
                    oldestAgeDays: { $max: "$ageDays" },
                    newestAgeDays: { $min: "$ageDays" }
                }
            }
        ]);

        return {
            averageAgeDays: Number((result?.averageAgeDays ?? 0).toFixed(2)),
            newestAgeDays: Number((result?.newestAgeDays ?? 0).toFixed(2)),
            oldestAgeDays: Number((result?.oldestAgeDays ?? 0).toFixed(2))
        };
    }

    private async getNewCustomersByMonth() {
        const customersByMonth = await UserModel.aggregate<{
            _id: { year: number; month: number };
            count: number;
        }>([
            { $match: { role: "CUSTOMER" } },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        return customersByMonth.map((entry) => ({
            month: `${entry._id.year}-${entry._id.month.toString().padStart(2, "0")}`,
            value: entry.count
        }));
    }

    private async getCustomerTotals() {
        const totalCustomers = await UserModel.countDocuments({ role: "CUSTOMER" });
        const repeatCustomerAgg = await OrderModel.aggregate<{ repeatCount: number }>([
            { $group: { _id: "$customerId", orders: { $sum: 1 } } },
            { $match: { orders: { $gt: 1 } } },
            { $count: "repeatCount" }
        ]);

        return {
            totalCustomers,
            repeatCustomers: repeatCustomerAgg[0]?.repeatCount ?? 0
        };
    }

    private async getStaffInquiriesHandled(): Promise<StaffMetric[]> {
        const inquiries = await InquiryModel.aggregate<{
            _id: string;
            count: number;
        }>([
            { $match: { staffId: { $exists: true, $ne: null } } },
            { $group: { _id: "$staffId", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        return inquiries.map((entry) => ({
            staffId: entry._id,
            count: entry.count
        }));
    }

    private async getStaffAppointmentsCompleted(): Promise<StaffMetric[]> {
        const appointments = await AppointmentModel.aggregate<{
            _id: string;
            count: number;
        }>([
            { $match: { status: "COMPLETED", staffId: { $exists: true, $ne: null } } },
            { $group: { _id: "$staffId", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        return appointments.map((entry) => ({
            staffId: entry._id,
            count: entry.count
        }));
    }

    private async getStaffConversions(): Promise<StaffMetric[]> {
        const invoices = await InvoiceModel.aggregate<{
            _id: string;
            count: number;
        }>([
            { $match: { status: "PAID" } },
            { $group: { _id: "$issuedBy", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        return invoices.map((entry) => ({
            staffId: entry._id,
            count: entry.count
        }));
    }

    private async enrichVehiclesWithMetric(
        metrics: { _id: string; metric: number }[]
    ): Promise<VehicleMovementMetric[]> {
        const vehicleIds = metrics
            .map((entry) => entry._id)
            .filter((id) => Types.ObjectId.isValid(id))
            .map((id) => new Types.ObjectId(id));
        const vehicles = await VehicleModel.find({ _id: { $in: vehicleIds } });
        const vehicleMap = new Map(vehicles.map((vehicle) => [vehicle._id.toString(), vehicle]));

        return metrics.map((entry) => {
            const vehicle = vehicleMap.get(entry._id);
            return {
                vehicleId: entry._id,
                make: vehicle?.make ?? "Unknown",
                model: vehicle?.model ?? "Unknown",
                year: vehicle?.year,
                status: vehicle?.status,
                metric: entry.metric
            };
        });
    }

    private async getStaffMap(staffIds: string[]): Promise<Map<string, string>> {
        const ids = staffIds
            .filter((id) => Boolean(id) && Types.ObjectId.isValid(id))
            .map((id) => new Types.ObjectId(id));

        if (ids.length === 0) return new Map();

        const staff = await UserModel.find({ _id: { $in: ids } });
        return new Map(staff.map((user) => [user._id.toString(), user.name]));
    }

    private calculateAgeInDays(date: Date): number {
        const now = Date.now();
        const created = date.getTime();
        const diff = now - created;
        return Math.round(diff / (1000 * 60 * 60 * 24));
    }
}
