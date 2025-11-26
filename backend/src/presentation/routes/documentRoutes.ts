import { Router } from "express";
import { DocumentController } from "../controllers/DocumentController";
import { authenticateUser } from "../middlewares/authenticateUser";
import { requireRole } from "../middlewares/requireRole";
import { upload } from "../middlewares/upload";

const router = Router();

// CUSTOMER/STAFF/ADMIN – Upload Document
router.post(
    "/upload",
    authenticateUser,
    upload.single("file"),
    DocumentController.upload
);

// CUSTOMER – Get Own Documents
router.get(
    "/my",
    authenticateUser,
    requireRole("CUSTOMER"),
    DocumentController.getMyDocuments
);

// STAFF/MANAGER – Verify a Document
router.put(
    "/verify/:id",
    authenticateUser,
    requireRole("SALES_STAFF", "MANAGER", "ADMIN"),
    DocumentController.verify
);

// CUSTOMER + STAFF – Delete Document
router.delete(
    "/:id",
    authenticateUser,
    requireRole("CUSTOMER", "SALES_STAFF", "MANAGER", "ADMIN"),
    DocumentController.delete
);

export default router;
