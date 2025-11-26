import { Router } from "express";
import { DeliveryTrackingController } from "../controllers/DeliveryTrackingController";

// If you have auth & role middleware, include them here:
// import { authMiddleware } from "../../middleware/auth";
// import { requireRole } from "../../middleware/roles";

const router = Router();
const deliveryTrackingController = new DeliveryTrackingController();

// ----------------------------------------
// CUSTOMER – Get their own tracking info
// GET /api/delivery-tracking/track/:vehicleId
// ----------------------------------------
router.get(
    "/track/:vehicleId",
    // authMiddleware,  // ← uncomment if needed
    deliveryTrackingController.trackMyVehicle
);

// ----------------------------------------
// STAFF/MANAGER – Update tracking status
// PUT /api/delivery-tracking/update/:vehicleId
// ----------------------------------------
router.put(
    "/update/:vehicleId",
    // authMiddleware,
    // requireRole("staff", "manager", "admin"),
    deliveryTrackingController.updateTrackingStatus
);

// ----------------------------------------
// ADMIN – View ALL tracking info
// GET /api/delivery-tracking/
// ----------------------------------------
router.get(
    "/",
    // authMiddleware,
    // requireRole("admin"),
    deliveryTrackingController.getAllTracking
);

export default router;

