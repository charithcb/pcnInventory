import { IUserRepository } from '../../interfaces/IUserRepository';
import { User } from '../../../domain/entities/User';
import { AppError } from '../../../shared/errors/AppError';
import { STAFF_ROLES } from './CreateStaffUseCase';

export class GetStaffMemberUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(staffId: string): Promise<User> {
        const user = await this.userRepository.findById(staffId);

        if (!user) {
            throw new AppError('Staff member not found', 404);
        }

        if (!STAFF_ROLES.includes(user.role) && user.role !== 'ADMIN') {
            throw new AppError('User is not a staff member', 400);
        }

        return user;
    }
}
