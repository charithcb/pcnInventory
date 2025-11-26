import { Router } from "express";
import { DeliveryTrackingController } from "../controllers/DeliveryTrackingController";

// If you have auth & role middleware, include them here:
// import { authMiddleware } from "../../middleware/auth";
// import { requireRole } from "../../middleware/roles";

const router = Router();

// ----------------------------------------
// CUSTOMER – Get their own tracking info
// GET /api/delivery-tracking/track/:vehicleId
// ----------------------------------------
router.get(
    "/track/:vehicleId",
    // authMiddleware,  // ← uncomment if needed
    DeliveryTrackingController.trackMyVehicle
);

// ----------------------------------------
// STAFF/MANAGER – Update tracking status
// PUT /api/delivery-tracking/update/:vehicleId
// ----------------------------------------
router.put(
    "/update/:vehicleId",
    // authMiddleware,
    // requireRole("staff", "manager", "admin"),
    DeliveryTrackingController.updateTrackingStatus
);

// ----------------------------------------
// ADMIN – View ALL tracking info
// GET /api/delivery-tracking/
// ----------------------------------------
router.get(
    "/",
    // authMiddleware,
    // requireRole("admin"),
    DeliveryTrackingController.getAllTracking
);

export default router;

