import { Router } from "express";
import { AuditLogController } from "../controllers/AuditLogController";
import { authenticateUser } from "../middlewares/authenticateUser";
import { requireRole } from "../middlewares/requireRole";

const router = Router();

router.get(
    "/",
    authenticateUser,
    requireRole("MANAGER", "ADMIN"),
    AuditLogController.list
);

export default router;
