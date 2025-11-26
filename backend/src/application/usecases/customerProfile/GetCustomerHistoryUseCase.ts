import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { IDeliveryTrackingRepository } from "../../../domain/repositories/IDeliveryTrackingRepository";
import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { IInquiryRepository } from "../../../domain/repositories/IInquiryRepository";

export class GetCustomerHistoryUseCase {
    constructor(
        private orderRepo: IOrderRepository,
        private deliveryRepo: IDeliveryTrackingRepository,
        private appointmentRepo: IAppointmentRepository,
        private inquiryRepo: IInquiryRepository
    ) {}

    async execute(userId: string) {
        const [orders, deliveries, appointments, inquiries] = await Promise.all([
            this.orderRepo.findByCustomer(userId),
            this.deliveryRepo.findByCustomer(userId),
            this.appointmentRepo.findByCustomer(userId),
            this.inquiryRepo.findByCustomer(userId)
        ]);

        const ongoingShipments = deliveries.filter(d => d.currentStatus !== "COMPLETED");

        return {
            orders,
            ongoingShipments,
            appointments,
            inquiries
        };
    }
}
