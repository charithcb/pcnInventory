import { User, UserRole } from '../../domain/entities/User';

export interface CreateUserData {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface IUserRepository {
    create(data: CreateUserData): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
}
