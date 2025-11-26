import { IDeliveryTrackingRepository } from "../../../domain/repositories/IDeliveryTrackingRepository";
import { TrackingStatus } from "../../../domain/entities/DeliveryTracking";

export class UpdateTrackingStatusUseCase {
    constructor(private repo: IDeliveryTrackingRepository) {}

    async execute(id: string, status: TrackingStatus, notes: string, userId: string) {
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

        return this.repo.update(id, updateData);
    }
}
