import { Request, Response } from "express";
import { MongoDeliveryTrackingRepository } from "../../infrastructure/database/repositories/MongoDeliveryTrackingRepository";

import { CreateDeliveryTrackingUseCase } from "../../application/usecases/delivery/CreateDeliveryTrackingUseCase";
import { GetTrackingByOrderUseCase } from "../../application/usecases/delivery/GetTrackingByOrderUseCase";
import { GetTrackingByVehicleUseCase } from "../../application/usecases/delivery/GetTrackingByVehicleUseCase";
import { UpdateTrackingStatusUseCase } from "../../application/usecases/delivery/UpdateTrackingStatusUseCase";
import { TRACKING_STATUSES, TrackingStatus } from "../../domain/entities/DeliveryTracking";
import { logAudit } from "../../shared/services/auditLogger";

const repo = new MongoDeliveryTrackingRepository();

export class DeliveryTrackingController {
    // -----------------------------------------------------
    // STAFF – Create tracking record for a pre-order/import
    // POST /api/delivery-tracking
    // -----------------------------------------------------
    async createTrackingRecord(req: Request, res: Response): Promise<void> {
        try {
            const useCase = new CreateDeliveryTrackingUseCase(repo);

            const { orderId, vehicleId, customerId, eta } = req.body;
            const createdBy = (req as any).user?.userId ?? "SYSTEM";

            if (!orderId || !vehicleId || !customerId) {
                res.status(400).json({ message: "orderId, vehicleId and customerId are required" });
                return;
            }

            const existing = await repo.findByOrder(orderId);
            if (existing) {
                res.status(409).json({ message: "Tracking record already exists for this order" });
                return;
            }

            const created = await useCase.execute({
                orderId,
                vehicleId,
                customerId,
                eta,
                currentStatus: "PURCHASED_FROM_AUCTION",
                statusTimeline: [
                    {
                        status: "PURCHASED_FROM_AUCTION",
                        date: new Date().toISOString(),
                        notes: "Order received and purchase confirmed",
                        updatedBy: createdBy
                    }
                ]
            });

            await logAudit({
                action: 'TRACKING_CREATED',
                userId: createdBy,
                entityType: 'DELIVERY_TRACKING',
                entityId: orderId,
                success: true,
                description: `Tracking record created for order ${orderId}`
            });

            res.status(201).json(created);
        } catch (error) {
            console.error("createTrackingRecord error:", error);
            res.status(400).json({ message: "Failed to create tracking record" });
        }
    }

    // -----------------------------------------------------
    // CUSTOMER – Track their vehicle by vehicleId
    // GET /api/delivery-tracking/track/vehicle/:vehicleId
    // -----------------------------------------------------
    async trackByVehicle(req: Request, res: Response): Promise<void> {
        try {
            const useCase = new GetTrackingByVehicleUseCase(repo);

            // req.user is custom → cast
            const vehicleId = req.params.vehicleId;
            const role = (req as any).user?.role;
            const userId = (req as any).user?.userId;

            if (!vehicleId) {
                res.status(400).json({ message: "vehicleId parameter is required" });
                return;
            }

            const result = await useCase.execute(vehicleId);

            if (!result) {
                res.status(404).json({ message: "Tracking not found for this vehicle" });
                return;
            }

            if (role === "CUSTOMER" && result.customerId !== userId) {
                res.status(403).json({ message: "You do not have access to this tracking record" });
                return;
            }

            res.json(result);
        } catch (error) {
            console.error("trackMyVehicle error:", error);
            res.status(400).json({ message: "Failed to fetch tracking info" });
        }
    }

    // -----------------------------------------------------
    // CUSTOMER – Track via Order ID
    // GET /api/delivery-tracking/track/order/:orderId
    // -----------------------------------------------------
    async trackByOrder(req: Request, res: Response): Promise<void> {
        try {
            const useCase = new GetTrackingByOrderUseCase(repo);

            const orderId = req.params.orderId;
            const role = (req as any).user?.role;
            const userId = (req as any).user?.userId;

            if (!orderId) {
                res.status(400).json({ message: "orderId parameter is required" });
                return;
            }

            const result = await useCase.execute(orderId);

            if (!result) {
                res.status(404).json({ message: "Tracking not found for this order" });
                return;
            }

            if (role === "CUSTOMER" && result.customerId !== userId) {
                res.status(403).json({ message: "You do not have access to this tracking record" });
                return;
            }

            res.json(result);
        } catch (error) {
            console.error("trackByOrder error:", error);
            res.status(400).json({ message: "Failed to fetch tracking info" });
        }
    }

    // -----------------------------------------------------
    // STAFF/MANAGER – Update tracking status
    // PUT /api/delivery-tracking/update
    // body: { vehicleId?: string, orderId?: string, status: TrackingStatus, notes?: string }
    // -----------------------------------------------------
    async updateTrackingStatus(req: Request, res: Response): Promise<void> {
        try {
            const useCase = new UpdateTrackingStatusUseCase(repo);

            const vehicleId: string | undefined = req.body.vehicleId;
            const orderId: string | undefined = req.body.orderId;
            const status: TrackingStatus = req.body.status;
            const notes: string = req.body.notes ?? "";
            const userId: string = (req as any).user?.userId ?? "";

            if (!vehicleId && !orderId) {
                res.status(400).json({ message: "Either vehicleId or orderId is required" });
                return;
            }

            if (!status) {
                res.status(400).json({ message: "status field is required" });
                return;
            }

            if (!TRACKING_STATUSES.includes(status)) {
                res.status(400).json({ message: "Invalid tracking status provided" });
                return;
            }

            const updated = await useCase.execute({ vehicleId, orderId }, status, notes, userId);
            res.json(updated);

            await logAudit({
                action: 'TRACKING_STATUS_CHANGED',
                userId,
                entityType: 'DELIVERY_TRACKING',
                entityId: vehicleId ?? orderId ?? "",
                success: true,
                description: `Tracking status updated to ${status}`,
                metadata: { notes }
            });

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






