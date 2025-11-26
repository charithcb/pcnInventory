import { Router } from "express";
import { OrderController } from "../controllers/OrderController";
import { authenticateUser } from "../middlewares/authenticateUser";
import { requireRole } from "../middlewares/requireRole";

const router = Router();

// CUSTOMER – Create Order
router.post(
    "/",
    authenticateUser,
    requireRole("CUSTOMER"),
    OrderController.create
);

// CUSTOMER – View Their Orders
router.get(
    "/my",
    authenticateUser,
    requireRole("CUSTOMER"),
    OrderController.getCustomerOrders
);

// CUSTOMER – Get Order by ID
router.get(
    "/:id",
    authenticateUser,
    requireRole("CUSTOMER", "SALES_STAFF", "MANAGER", "ADMIN"),
    OrderController.getById
);

// STAFF/MANAGER – Update Order Status
router.put(
    "/status/:id",
    authenticateUser,
    requireRole("SALES_STAFF", "MANAGER", "ADMIN"),
    OrderController.updateStatus
);

export default router;

