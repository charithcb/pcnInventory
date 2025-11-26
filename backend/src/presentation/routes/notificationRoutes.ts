import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { authenticateUser } from '../middlewares/authenticateUser';

const router = Router();

// Any authenticated user: get own notifications
router.get(
    '/',
    authenticateUser,
    NotificationController.getMyNotifications
);

// Mark notification as read
router.post(
    '/:id/read',
    authenticateUser,
    NotificationController.markRead
);

export default router;
