import { Router } from "express";
import { AdminDashboardController } from "../controllers/AdminDashboardController";
import { authenticateUser } from "../middlewares/authenticateUser";
import { requireRole } from "../middlewares/requireRole";

const router = Router();

router.get(
    "/",
    authenticateUser,
    requireRole("ADMIN", "MANAGER"),
    AdminDashboardController.getMetrics
);

export default router;
