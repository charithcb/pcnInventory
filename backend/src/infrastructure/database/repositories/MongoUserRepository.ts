import { IUserRepository, CreateUserData } from '../../../application/interfaces/IUserRepository';
import { StaffActivity, User } from '../../../domain/entities/User';
import { UserModel } from '../models/UserModel';

const mapUserDocumentToEntity = (user: any): User => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role,
    isActive: user.isActive,
    permissions: user.permissions || [],
    activityLog: user.activityLog || [],
    lastActiveAt: user.lastActiveAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

export class MongoUserRepository implements IUserRepository {
    async create(data: CreateUserData): Promise<User> {
        const user = await UserModel.create({
            ...data,
            isActive: data.isActive ?? true,
            permissions: data.permissions ?? [],
            activityLog: data.activityLog ?? [],
        });

        return mapUserDocumentToEntity(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({ email });

        if (!user) return null;

        return mapUserDocumentToEntity(user);
    }

    async findById(id: string): Promise<User | null> {
        const user = await UserModel.findById(id);

        if (!user) return null;

        return mapUserDocumentToEntity(user);
    }

    async update(
        id: string,
        data: Partial<
            Pick<User, 'name' | 'email' | 'password' | 'role' | 'permissions' | 'isActive' | 'lastActiveAt' | 'activityLog'>
        >
    ): Promise<User | null> {
        const updated = await UserModel.findByIdAndUpdate(id, data, { new: true });

        if (!updated) return null;

        return mapUserDocumentToEntity(updated);
    }

    async listStaff(): Promise<User[]> {
        const staffRoles = ['SALES_STAFF', 'CRO', 'MANAGER', 'ADMIN'];
        const users = await UserModel.find({ role: { $in: staffRoles } });

        return users.map(mapUserDocumentToEntity);
    }

    async appendActivity(id: string, activity: StaffActivity): Promise<User | null> {
        const timestamp = activity.timestamp || new Date();
        const updated = await UserModel.findByIdAndUpdate(
            id,
            {
                $push: { activityLog: { ...activity, timestamp } },
                lastActiveAt: timestamp,
            },
            { new: true }
        );

        if (!updated) return null;

        return mapUserDocumentToEntity(updated);
    }
}
