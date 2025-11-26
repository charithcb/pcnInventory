import { IUserRepository } from '../../interfaces/IUserRepository';
import { StaffActivity, User } from '../../../domain/entities/User';
import { AppError } from '../../../shared/errors/AppError';

interface TrackStaffActivityRequest {
    staffId: string;
    action: string;
    performedBy?: string;
    details?: string;
}

export class TrackStaffActivityUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(data: TrackStaffActivityRequest): Promise<User> {
        const staff = await this.userRepository.findById(data.staffId);

        if (!staff) {
            throw new AppError('Staff member not found', 404);
        }

        const isStaff = ['SALES_STAFF', 'CRO', 'MANAGER', 'ADMIN'].includes(staff.role);
        if (!isStaff) {
            throw new AppError('User is not a staff member', 400);
        }

        const activity: StaffActivity = {
            action: data.action,
            performedBy: data.performedBy,
            details: data.details,
            timestamp: new Date(),
        };

        const updated = await this.userRepository.appendActivity(data.staffId, activity);

        if (!updated) {
            throw new AppError('Staff member not found', 404);
        }

        return updated;
    }
}
