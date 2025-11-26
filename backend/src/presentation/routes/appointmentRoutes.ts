import { Router } from "express";
import { AppointmentController } from "../controllers/AppointmentController";
import { authenticateUser } from "../middlewares/authenticateUser";
import { requireRole } from "../middlewares/requireRole";

const router = Router();

// CUSTOMER – Create Appointment
router.post(
    "/",
    authenticateUser,
    requireRole("CUSTOMER"),
    AppointmentController.create
);

// CUSTOMER – View Own Appointments
router.get(
    "/my",
    authenticateUser,
    requireRole("CUSTOMER"),
    AppointmentController.getMyAppointments
);

// STAFF/MANAGER – View All
router.get(
    "/",
    authenticateUser,
    requireRole("SALES_STAFF", "MANAGER", "ADMIN"),
    AppointmentController.getAll
);

// STAFF/MANAGER – Update Status
router.put(
    "/status/:id",
    authenticateUser,
    requireRole("SALES_STAFF", "MANAGER", "ADMIN"),
    AppointmentController.updateStatus
);

export default router;


