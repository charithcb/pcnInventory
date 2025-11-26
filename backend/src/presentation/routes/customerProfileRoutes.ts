import { Router } from "express";
import { CustomerProfileController } from "../controllers/CustomerProfileController";
import { authenticateUser } from "../middlewares/authenticateUser";
import { requireRole } from "../middlewares/requireRole";
import { upload } from "../middlewares/upload";

const router = Router();

router.get(
    "/me",
    authenticateUser,
    requireRole("CUSTOMER"),
    CustomerProfileController.getProfile
);

router.put(
    "/me",
    authenticateUser,
    requireRole("CUSTOMER"),
    CustomerProfileController.updateProfile
);

router.get(
    "/history",
    authenticateUser,
    requireRole("CUSTOMER"),
    CustomerProfileController.getHistory
);

router.post(
    "/change-password",
    authenticateUser,
    requireRole("CUSTOMER"),
    CustomerProfileController.changePassword
);

router.get(
    "/notifications",
    authenticateUser,
    requireRole("CUSTOMER"),
    CustomerProfileController.getNotificationSettings
);

router.put(
    "/notifications",
    authenticateUser,
    requireRole("CUSTOMER"),
    CustomerProfileController.updateNotificationSettings
);

router.get(
    "/documents",
    authenticateUser,
    requireRole("CUSTOMER"),
    CustomerProfileController.getDocuments
);

router.post(
    "/documents",
    authenticateUser,
    requireRole("CUSTOMER"),
    upload.single("file"),
    CustomerProfileController.uploadDocument
);

export default router;
