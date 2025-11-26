import { IUserRepository } from '../../interfaces/IUserRepository';
import { User } from '../../../domain/entities/User';
import { AppError } from '../../../shared/errors/AppError';

interface ToggleStaffStatusRequest {
    staffId: string;
    isActive: boolean;
}

export class ToggleStaffStatusUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(data: ToggleStaffStatusRequest): Promise<User> {
        const existing = await this.userRepository.findById(data.staffId);

        if (!existing) {
            throw new AppError('Staff member not found', 404);
        }

        const isStaff = ['SALES_STAFF', 'CRO', 'MANAGER', 'ADMIN'].includes(existing.role);
        if (!isStaff) {
            throw new AppError('User is not a staff member', 400);
        }

        const updated = await this.userRepository.update(data.staffId, { isActive: data.isActive });

        if (!updated) {
            throw new AppError('Staff member not found', 404);
        }

        return updated;
    }
}
