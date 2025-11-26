import { Router } from "express";
import { VehicleController } from "../controllers/VehicleController";
import { authenticateUser } from "../middlewares/authenticateUser";
import { requireRole } from "../middlewares/requireRole";

const router = Router();

// PUBLIC ENDPOINTS
router.get("/", VehicleController.getAll);
router.get("/filter", VehicleController.filter);
router.get("/low-stock", authenticateUser, requireRole("SALES_STAFF", "MANAGER", "ADMIN"), VehicleController.lowStock);
router.get("/:id", VehicleController.getById);

// CREATE vehicle
router.post(
    "/",
    authenticateUser,
    requireRole("SALES_STAFF", "MANAGER", "ADMIN"),
    VehicleController.create
);

// Update stock and availability
router.patch(
    "/:id/stock",
    authenticateUser,
    requireRole("SALES_STAFF", "MANAGER", "ADMIN"),
    VehicleController.updateStock
);

router.patch(
    "/:id/status",
    authenticateUser,
    requireRole("SALES_STAFF", "MANAGER", "ADMIN"),
    VehicleController.updateAvailability
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

