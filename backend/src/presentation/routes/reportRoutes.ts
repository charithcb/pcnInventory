import { Router } from "express";
import { ReportsController } from "../controllers/ReportsController";
import { authenticateUser } from "../middlewares/authenticateUser";
import { requireRole } from "../middlewares/requireRole";

const router = Router();

router.get(
    "/analytics",
    authenticateUser,
    requireRole("ADMIN"),
    ReportsController.getAnalytics
);

export default router;
