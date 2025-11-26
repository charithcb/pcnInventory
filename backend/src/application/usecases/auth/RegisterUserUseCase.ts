import { IUserRepository } from '../../interfaces/IUserRepository';
import { User, UserRole } from '../../../domain/entities/User';
import { AppError } from '../../../shared/errors/AppError';
import { hashPassword } from '../../../shared/utils/passwordUtils';

interface RegisterUserRequest {
    name: string;
    email: string;
    password: string;
    role?: UserRole; // default CUSTOMER for public registration
}

export class RegisterUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(data: RegisterUserRequest): Promise<User> {
        const existing = await this.userRepository.findByEmail(data.email);
        if (existing) {
            throw new AppError('Email already in use', 409);
        }

        const hashed = await hashPassword(data.password);

        const role: UserRole = data.role || 'CUSTOMER';

        const user = await this.userRepository.create({
            name: data.name,
            email: data.email,
            password: hashed,
            role,
        });

        return user;
    }
}
