import { Router } from "express";
import { DeliveryTrackingController } from "../controllers/DeliveryTrackingController";
import { authenticateUser } from "../middlewares/authenticateUser";
import { requireRole } from "../middlewares/requireRole";

const router = Router();
const deliveryTrackingController = new DeliveryTrackingController();

// CUSTOMER – Get tracking for THEIR order
router.get(
    "/order/:orderId",
    authenticateUser,
    requireRole("CUSTOMER"),
    (req, res) => deliveryTrackingController.getTrackingByOrder(req, res)
);

// STAFF/MANAGER – Update tracking status
router.put(
    "/status/:trackingId",
    authenticateUser,
    requireRole("SALES_STAFF", "MANAGER", "ADMIN"),
    (req, res) => deliveryTrackingController.updateStatus(req, res)
);

// STAFF/MANAGER – Create tracking entry for an order
router.post(
    "/",
    authenticateUser,
    requireRole("SALES_STAFF", "MANAGER", "ADMIN"),
    (req, res) => deliveryTrackingController.create(req, res)
);

// ADMIN – View ALL tracking info
router.get(
    "/",
    authenticateUser,
    requireRole("ADMIN", "MANAGER"),
    (req, res) => deliveryTrackingController.getAllTracking(req, res)
);

export default router;

