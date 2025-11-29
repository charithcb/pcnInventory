import express, { Express, Request, Response } from 'express';
import { corsMiddleware } from './shared/middleware/corsMiddleware';

import authRoutes from './presentation/routes/authRoutes';
import vehicleRoutes from './presentation/routes/vehicleRoutes';
import orderRoutes from './presentation/routes/orderRoutes';
import reservationRoutes from './presentation/routes/reservationRoutes';
import inquiryRoutes from './presentation/routes/inquiryRoutes';
import notificationRoutes from './presentation/routes/notificationRoutes';
import appointmentRoutes from './presentation/routes/appointmentRoutes';
import deliveryTrackingRoutes from "./presentation/routes/deliveryTrackingRoutes";
import documentRoutes from "./presentation/routes/documentRoutes";
import invoiceRoutes from "./presentation/routes/invoiceRoutes";
import adminDashboardRoutes from "./presentation/routes/adminDashboardRoutes";
import reportRoutes from "./presentation/routes/reportRoutes";
import customerProfileRoutes from "./presentation/routes/customerProfileRoutes";
import staffRoutes from "./presentation/routes/staffRoutes";
import auditLogRoutes from "./presentation/routes/auditLogRoutes";

const app: Express = express();
app.use(express.json());
app.use(corsMiddleware);

app.get('/', (req: Request, res: Response) => {
    res.send('PCN Inventory Backend Running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use("/api/delivery-tracking", deliveryTrackingRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/customer-profile", customerProfileRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/audit-logs", auditLogRoutes);

export default app;
