import { IUserRepository, CreateUserData } from '../../../application/interfaces/IUserRepository';
import { User } from '../../../domain/entities/User';
import { UserModel } from '../models/UserModel';

export class MongoUserRepository implements IUserRepository {
    async create(data: CreateUserData): Promise<User> {
        const user = await UserModel.create(data);

        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({ email });

        if (!user) return null;

        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    async findById(id: string): Promise<User | null> {
        const user = await UserModel.findById(id);

        if (!user) return null;

        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    async update(
        id: string,
        data: Partial<Pick<User, 'name' | 'email' | 'password'>>
    ): Promise<User | null> {
        const updated = await UserModel.findByIdAndUpdate(id, data, { new: true });

        if (!updated) return null;

        return {
            id: updated._id.toString(),
            name: updated.name,
            email: updated.email,
            password: updated.password,
            role: updated.role,
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
        };
    }
}
