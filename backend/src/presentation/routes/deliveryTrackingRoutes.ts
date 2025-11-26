import { Router } from "express";
import { DeliveryTrackingController } from "../controllers/DeliveryTrackingController";
import { authenticateUser } from "../middlewares/authenticateUser";
import { requireRole } from "../middlewares/requireRole";

const router = Router();

// CUSTOMER – Get tracking for THEIR order
router.get(
    "/order/:orderId",
    authenticateUser,
    requireRole("CUSTOMER"),
    DeliveryTrackingController.getTrackingByOrder
);

// STAFF/MANAGER – Update tracking status
router.put(
    "/status/:trackingId",
    authenticateUser,
    requireRole("SALES_STAFF", "MANAGER", "ADMIN"),
    DeliveryTrackingController.updateStatus
);

// STAFF/MANAGER – Create tracking entry for an order
router.post(
    "/",
    authenticateUser,
    requireRole("SALES_STAFF", "MANAGER", "ADMIN"),
    DeliveryTrackingController.create
);

export default router;

