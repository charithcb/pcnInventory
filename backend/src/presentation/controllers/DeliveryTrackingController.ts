import { Request, Response } from "express";
import { MongoDeliveryTrackingRepository } from "../../infrastructure/database/repositories/MongoDeliveryTrackingRepository";

import { GetTrackingForCustomerUseCase } from "../../application/usecases/delivery/GetTrackingForCustomerUseCase";
import { GetTrackingByOrderUseCase } from "../../application/usecases/delivery/GetTrackingByOrderUseCase";
import { CreateDeliveryTrackingUseCase } from "../../application/usecases/delivery/CreateDeliveryTrackingUseCase";
import { UpdateTrackingStatusUseCase } from "../../application/usecases/delivery/UpdateTrackingStatusUseCase";

const repo = new MongoDeliveryTrackingRepository();

export class DeliveryTrackingController {
    // -----------------------------------------------------
    // CUSTOMER – Get tracking by order
    // GET /api/delivery-tracking/order/:orderId
    // -----------------------------------------------------
    async getTrackingByOrder(req: Request, res: Response): Promise<void> {
        try {
            const useCase = new GetTrackingByOrderUseCase(repo);
            const { orderId } = req.params;

            if (!orderId) {
                res.status(400).json({ message: "orderId parameter is required" });
                return;
            }

            const tracking = await useCase.execute(orderId);

            if (!tracking) {
                res.status(404).json({ message: "Tracking not found for the specified order" });
                return;
            }

            res.json(tracking);
        } catch (error) {
            console.error("getTrackingByOrder error:", error);
            res.status(500).json({ message: "Failed to fetch tracking info" });
        }
    }

    // -----------------------------------------------------
    // STAFF/MANAGER – Create tracking entry
    // POST /api/delivery-tracking/
    // -----------------------------------------------------
    async create(req: Request, res: Response): Promise<void> {
        try {
            const useCase = new CreateDeliveryTrackingUseCase(repo);
            const { orderId, vehicleId, customerId, currentStatus, statusTimeline, eta } = req.body;

            if (!orderId || !vehicleId || !customerId || !currentStatus) {
                res.status(400).json({ message: "orderId, vehicleId, customerId, and currentStatus are required" });
                return;
            }

            const trackingData = {
                orderId,
                vehicleId,
                customerId,
                currentStatus,
                eta,
                statusTimeline: statusTimeline ?? [],
            } as any;

            const created = await useCase.execute(trackingData);
            res.status(201).json(created);
        } catch (error) {
            console.error("create tracking error:", error);
            res.status(400).json({ message: "Failed to create tracking entry" });
        }
    }

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
    // STAFF/MANAGER – Update tracking status (alias)
    // PUT /api/delivery-tracking/status/:trackingId
    // -----------------------------------------------------
    async updateStatus(req: Request, res: Response): Promise<void> {
        req.params.vehicleId = req.params.trackingId;
        await this.updateTrackingStatus(req, res);
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






