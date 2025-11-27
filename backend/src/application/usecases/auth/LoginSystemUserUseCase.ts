import { AppError } from '../../../shared/errors/AppError';
import { generateToken } from '../../../shared/utils/jwtUtils';
import { UserRole } from '../../../domain/entities/User';

interface LoginSystemUserRequest {
    username: string;
    password: string;
}

interface LoginSystemUserResponse {
    token: string;
    user: {
        id: string;
        email: string;
        role: UserRole;
    };
}

export class LoginSystemUserUseCase {
    private systemCredentials: { username: string; password: string; role: UserRole }[];

    constructor() {
        this.systemCredentials = [
            {
                username: process.env.SYSTEM_ADMIN_USERNAME || 'pcn-admin',
                password: process.env.SYSTEM_ADMIN_PASSWORD || 'ChangeMeAdmin!',
                role: 'ADMIN',
            },
            {
                username: process.env.SYSTEM_STAFF_USERNAME || 'pcn-staff',
                password: process.env.SYSTEM_STAFF_PASSWORD || 'ChangeMeStaff!',
                role: 'SALES_STAFF',
            },
        ];
    }

    async execute(data: LoginSystemUserRequest): Promise<LoginSystemUserResponse> {
        const match = this.systemCredentials.find(
            (cred) => cred.username === data.username && cred.password === data.password,
        );

        if (!match) {
            throw new AppError('Invalid system credentials', 401);
        }

        const token = generateToken({
            userId: `system-${match.role.toLowerCase()}`,
            email: `${match.username}@system.local`,
            role: match.role,
        });

        return {
            token,
            user: {
                id: `system-${match.role.toLowerCase()}`,
                email: `${match.username}@system.local`,
                role: match.role,
            },
        };
    }
}
