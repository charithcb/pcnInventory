import { Router } from "express";
import { InvoiceController } from "../controllers/InvoiceController";
import { authenticateUser } from "../middlewares/authenticateUser";
import { requireRole } from "../middlewares/requireRole";

const router = Router();

// STAFF/MANAGER – Generate Invoice
router.post(
    "/",
    authenticateUser,
    requireRole("SALES_STAFF", "MANAGER", "ADMIN"),
    InvoiceController.generate
);

// CUSTOMER – View My Invoices
router.get(
    "/my",
    authenticateUser,
    requireRole("CUSTOMER"),
    InvoiceController.getMyInvoices
);

// STAFF/MANAGER – View Invoices by Order
router.get(
    "/order/:orderId",
    authenticateUser,
    requireRole("SALES_STAFF", "MANAGER", "ADMIN"),
    InvoiceController.getByOrder
);

// ANY AUTHORIZED USER – Get Invoice by ID
router.get(
    "/:id",
    authenticateUser,
    requireRole("CUSTOMER", "SALES_STAFF", "MANAGER", "ADMIN"),
    InvoiceController.getById
);

// CUSTOMER – Mark Invoice as Paid
router.put(
    "/pay/:id",
    authenticateUser,
    requireRole("CUSTOMER", "MANAGER", "ADMIN"),
    InvoiceController.markPaid
);

// ADMIN/MANAGER – View All Invoices
router.get(
    "/",
    authenticateUser,
    requireRole("MANAGER", "ADMIN"),
    InvoiceController.getAll
);

export default router;
