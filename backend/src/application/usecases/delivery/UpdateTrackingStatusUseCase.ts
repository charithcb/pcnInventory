import { IDeliveryTrackingRepository } from "../../../domain/repositories/IDeliveryTrackingRepository";
import { TRACKING_STATUSES, TrackingStatus } from "../../../domain/entities/DeliveryTracking";

export class UpdateTrackingStatusUseCase {
    constructor(private repo: IDeliveryTrackingRepository) {}

    async execute(
        lookup: { vehicleId?: string; orderId?: string },
        status: TrackingStatus,
        notes: string,
        userId: string
    ) {
        if (!TRACKING_STATUSES.includes(status)) {
            throw new Error("Invalid tracking status");
        }

        const record = lookup.vehicleId
            ? await this.repo.findByVehicle(lookup.vehicleId)
            : await this.repo.findByOrder(lookup.orderId ?? "");

        if (!record) {
            throw new Error("Tracking record not found for the provided identifier");
        }

        const updateData: any = {
            currentStatus: status,
            $push: {
                statusTimeline: {
                    status,
                    date: new Date().toISOString(),
                    notes,
                    updatedBy: userId
                }
            }
        };

        return this.repo.update(record.id ?? (record as any)._id, updateData);
    }
}
