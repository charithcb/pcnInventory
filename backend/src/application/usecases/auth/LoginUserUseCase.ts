import { IUserRepository } from '../../interfaces/IUserRepository';
import { AppError } from '../../../shared/errors/AppError';
import { comparePasswords } from '../../../shared/utils/passwordUtils';
import { generateToken } from '../../../shared/utils/jwtUtils';

interface LoginUserRequest {
    email: string;
    password: string;
}

interface LoginUserResponse {
    token: string;
}

export class LoginUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(data: LoginUserRequest): Promise<LoginUserResponse> {
        const user = await this.userRepository.findByEmail(data.email);

        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        if (user.isActive === false) {
            throw new AppError('Account is deactivated', 403);
        }

        const isValid = await comparePasswords(data.password, user.password);

        if (!isValid) {
            throw new AppError('Invalid email or password', 401);
        }

        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        return { token };
    }
}
