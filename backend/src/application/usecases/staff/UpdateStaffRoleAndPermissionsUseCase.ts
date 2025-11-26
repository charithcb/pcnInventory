import { IUserRepository } from '../../interfaces/IUserRepository';
import { User, UserRole } from '../../../domain/entities/User';
import { AppError } from '../../../shared/errors/AppError';
import { STAFF_ROLES } from './CreateStaffUseCase';

interface UpdateStaffRequest {
    staffId: string;
    role?: UserRole;
    permissions?: string[];
}

export class UpdateStaffRoleAndPermissionsUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(data: UpdateStaffRequest): Promise<User> {
        const existing = await this.userRepository.findById(data.staffId);

        if (!existing) {
            throw new AppError('Staff member not found', 404);
        }

        const targetRole = data.role ?? existing.role;

        if (!STAFF_ROLES.includes(targetRole) && targetRole !== 'ADMIN') {
            throw new AppError('User is not a staff member', 400);
        }

        if (data.role && !STAFF_ROLES.includes(data.role)) {
            throw new AppError('Invalid role for staff member', 400);
        }

        const updated = await this.userRepository.update(data.staffId, {
            role: data.role,
            permissions: data.permissions,
        });

        if (!updated) {
            throw new AppError('Staff member not found', 404);
        }

        return updated;
    }
}
