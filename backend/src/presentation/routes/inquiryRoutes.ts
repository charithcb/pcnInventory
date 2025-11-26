import { Router } from "express";
import { InquiryController } from "../controllers/InquiryController";
import { authenticateUser } from "../middlewares/authenticateUser";
import { requireRole } from "../middlewares/requireRole";

const router = Router();

// CUSTOMER – View My Inquiries
router.get(
    "/my",
    authenticateUser,
    requireRole("CUSTOMER"),
    InquiryController.getMyInquiries
);

// STAFF/MANAGER – View All Inquiries
router.get(
    "/",
    authenticateUser,
    requireRole("SALES_STAFF", "MANAGER", "ADMIN"),
    InquiryController.getAll
);

// STAFF – Update Inquiry Status
router.put(
    "/status/:id",
    authenticateUser,
    requireRole("SALES_STAFF", "MANAGER", "ADMIN"),
    InquiryController.updateStatus
);

export default router;

