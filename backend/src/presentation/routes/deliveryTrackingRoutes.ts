import { Router } from "express";
import { DeliveryTrackingController } from "../controllers/DeliveryTrackingController";
import { authenticateUser } from "../middlewares/authenticateUser";
import { requireRole } from "../middlewares/requireRole";

const router = Router();
const deliveryTrackingController = new DeliveryTrackingController();

// ----------------------------------------
// STAFF – Create tracking record for a pre-order/import
// POST /api/delivery-tracking
// ----------------------------------------
router.post(
    "/",
    authenticateUser,
    requireRole("SALES_STAFF", "MANAGER", "ADMIN"),
    deliveryTrackingController.createTrackingRecord
);

// ----------------------------------------
// CUSTOMER – Get tracking info via vehicle ID
// GET /api/delivery-tracking/track/vehicle/:vehicleId
// ----------------------------------------
router.get(
    "/track/vehicle/:vehicleId",
    authenticateUser,
    requireRole("CUSTOMER", "SALES_STAFF", "MANAGER", "ADMIN"),
    deliveryTrackingController.trackByVehicle
);

// ----------------------------------------
// CUSTOMER – Get tracking info via order ID
// GET /api/delivery-tracking/track/order/:orderId
// ----------------------------------------
router.get(
    "/track/order/:orderId",
    authenticateUser,
    requireRole("CUSTOMER", "SALES_STAFF", "MANAGER", "ADMIN"),
    deliveryTrackingController.trackByOrder
);

// ----------------------------------------
// STAFF/MANAGER – Update tracking status
// PUT /api/delivery-tracking/update
// ----------------------------------------
router.put(
    "/update",
    authenticateUser,
    requireRole("SALES_STAFF", "MANAGER", "ADMIN"),
    deliveryTrackingController.updateTrackingStatus
);

// ----------------------------------------
// STAFF/MANAGER – View ALL tracking info
// GET /api/delivery-tracking/
// ----------------------------------------
router.get(
    "/",
    authenticateUser,
    requireRole("SALES_STAFF", "MANAGER", "ADMIN"),
    deliveryTrackingController.getAllTracking
);

export default router;

