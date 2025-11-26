import { Router } from "express";
import { VehicleController } from "../controllers/VehicleController";
import { authenticateUser } from "../middlewares/authenticateUser";
import { requireRole } from "../middlewares/requireRole";

const router = Router();

// CREATE vehicle
router.post(
    "/",
    authenticateUser,
    requireRole("SALES_STAFF", "MANAGER", "ADMIN"),
    VehicleController.create
);

// UPDATE vehicle
router.put(
    "/:id",
    authenticateUser,
    requireRole("SALES_STAFF", "MANAGER", "ADMIN"),
    VehicleController.update
);

// DELETE vehicle
router.delete(
    "/:id",
    authenticateUser,
    requireRole("MANAGER", "ADMIN"),
    VehicleController.delete
);

export default router;

