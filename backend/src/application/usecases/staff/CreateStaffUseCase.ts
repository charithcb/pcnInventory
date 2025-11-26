import { IUserRepository } from '../../interfaces/IUserRepository';
import { User, UserRole } from '../../../domain/entities/User';
import { AppError } from '../../../shared/errors/AppError';
import { hashPassword } from '../../../shared/utils/passwordUtils';

const STAFF_ROLES: UserRole[] = ['SALES_STAFF', 'CRO', 'MANAGER'];

interface CreateStaffRequest {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    permissions?: string[];
}

export class CreateStaffUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(data: CreateStaffRequest): Promise<User> {
        if (!STAFF_ROLES.includes(data.role)) {
            throw new AppError('Invalid role for staff account', 400);
        }

        const existing = await this.userRepository.findByEmail(data.email);
        if (existing) {
            throw new AppError('Email already in use', 409);
        }

        const hashed = await hashPassword(data.password);

        return this.userRepository.create({
            name: data.name,
            email: data.email,
            password: hashed,
            role: data.role,
            permissions: data.permissions ?? [],
            isActive: true,
        });
    }
}

export { STAFF_ROLES };
