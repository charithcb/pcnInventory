import { StaffActivity, User, UserRole } from '../../domain/entities/User';

export interface CreateUserData {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    isActive?: boolean;
    permissions?: string[];
    activityLog?: StaffActivity[];
    lastActiveAt?: Date;
}

export interface IUserRepository {
    create(data: CreateUserData): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    update(
        id: string,
        data: Partial<Pick<User, 'name' | 'email' | 'password' | 'role' | 'permissions' | 'isActive' | 'lastActiveAt' | 'activityLog'>>
    ): Promise<User | null>;
    listStaff(): Promise<User[]>;
    appendActivity(id: string, activity: StaffActivity): Promise<User | null>;
}
