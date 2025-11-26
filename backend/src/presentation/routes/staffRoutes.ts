import { Router } from 'express';

import { StaffController } from '../controllers/StaffController';
import { authenticateUser } from '../middlewares/authenticateUser';
import { requireRole } from '../middlewares/requireRole';

const router = Router();

router.post('/', authenticateUser, requireRole('MANAGER', 'ADMIN'), StaffController.create);
router.get('/', authenticateUser, requireRole('MANAGER', 'ADMIN'), StaffController.list);
router.get('/:id', authenticateUser, requireRole('MANAGER', 'ADMIN'), StaffController.getById);
router.patch(
    '/:id/role-permissions',
    authenticateUser,
    requireRole('MANAGER', 'ADMIN'),
    StaffController.updateRoleAndPermissions
);
router.patch('/:id/status', authenticateUser, requireRole('MANAGER', 'ADMIN'), StaffController.toggleStatus);
router.post('/:id/activity', authenticateUser, requireRole('MANAGER', 'ADMIN'), StaffController.recordActivity);
router.get('/:id/activity', authenticateUser, requireRole('MANAGER', 'ADMIN'), StaffController.getActivityLog);
router.get('/:id/performance', authenticateUser, requireRole('MANAGER', 'ADMIN'), StaffController.getPerformanceMetrics);

export default router;
