import { Router } from "express";
import { ReservationController } from "../controllers/ReservationController";
import { authenticateUser } from "../middlewares/authenticateUser";
import { requireRole } from "../middlewares/requireRole";

const router = Router();

// CUSTOMER – Create Reservation
router.post(
    "/",
    authenticateUser,
    requireRole("CUSTOMER"),
    ReservationController.create
);

// CUSTOMER – My Reservations
router.get(
    "/my",
    authenticateUser,
    requireRole("CUSTOMER"),
    ReservationController.getMyReservations
);

// STAFF/MANAGER – View All Reservations
router.get(
    "/",
    authenticateUser,
    requireRole("SALES_STAFF", "MANAGER", "ADMIN"),
    ReservationController.getAll
);

// STAFF/MANAGER – Update Reservation Status
router.put(
    "/status/:id",
    authenticateUser,
    requireRole("SALES_STAFF", "MANAGER", "ADMIN"),
    ReservationController.updateStatus
);

export default router;

