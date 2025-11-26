import { Request, Response } from "express";
import { MongoDeliveryTrackingRepository } from "../../infrastructure/database/repositories/MongoDeliveryTrackingRepository";

import { GetTrackingForCustomerUseCase } from "../../application/usecases/delivery/GetTrackingForCustomerUseCase";
import { UpdateTrackingStatusUseCase } from "../../application/usecases/delivery/UpdateTrackingStatusUseCase";

const repo = new MongoDeliveryTrackingRepository();

export class DeliveryTrackingController {
    // -----------------------------------------------------
    // CUSTOMER – Track their vehicle
    // GET /api/delivery-tracking/track/:vehicleId
    // -----------------------------------------------------
    async trackMyVehicle(req: Request, res: Response): Promise<void> {
        try {
            const useCase = new GetTrackingForCustomerUseCase(repo);

            // req.user is custom → cast
            const customerId = (req as any).user?.userId;
            const vehicleId = req.params.vehicleId;

            if (!customerId) {
                res.status(401).json({ message: "Unauthorized: customerId missing" });
                return;
            }

            if (!vehicleId) {
                res.status(400).json({ message: "vehicleId parameter is required" });
                return;
            }

            const result = await useCase.execute(customerId);
            res.json(result);
        } catch (error) {
            console.error("trackMyVehicle error:", error);
            res.status(400).json({ message: "Failed to fetch tracking info" });
        }
    }

    // -----------------------------------------------------
    // STAFF/MANAGER – Update tracking status
    // PUT /api/delivery-tracking/update/:vehicleId
    // body: { status: "ON_FREIGHT" | "ON_THE_WAY" | ... }
    // -----------------------------------------------------
    async updateTrackingStatus(req: Request, res: Response): Promise<void> {
        try {
            const useCase = new UpdateTrackingStatusUseCase(repo);

            const vehicleId: string = req.params.vehicleId;
            const status: any = req.body.status;
            const notes: string = req.body.notes ?? "";
            const userId: string = (req as any).user?.userId ?? "";

            if (!vehicleId) {
                res.status(400).json({ message: "vehicleId parameter is required" });
                return;
            }

            if (!status) {
                res.status(400).json({ message: "status field is required" });
                return;
            }

            const updated = await useCase.execute(vehicleId, status, notes, userId);
            res.json(updated);

        } catch (error) {
            console.error("updateTrackingStatus error:", error);
            res.status(400).json({ message: "Failed to update tracking status" });
        }
    }


    // -----------------------------------------------------
    // ADMIN/MANAGER – View ALL tracking data
    // GET /api/delivery-tracking/
    // -----------------------------------------------------
    async getAllTracking(_req: Request, res: Response): Promise<void> {
        try {
            // ✅ Use existing repository method
            const all = await repo.findAll();

            res.json({
                count: all.length,
                data: all,
            });
        } catch (error) {
            console.error("getAllTracking error:", error);
            res.status(500).json({
                message: "Failed to fetch tracking data",
            });
        }
    }
}






