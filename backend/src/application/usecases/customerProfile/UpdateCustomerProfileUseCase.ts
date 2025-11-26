import { Address, CustomerProfile } from "../../../domain/entities/CustomerProfile";
import { ICustomerProfileRepository } from "../../../domain/repositories/ICustomerProfileRepository";
import { IUserRepository } from "../../interfaces/IUserRepository";
import { AppError } from "../../../shared/errors/AppError";

interface UpdateCustomerProfileRequest {
    userId: string;
    name?: string;
    email?: string;
    phone?: string;
    address?: Address;
}

export class UpdateCustomerProfileUseCase {
    constructor(
        private profileRepo: ICustomerProfileRepository,
        private userRepo: IUserRepository
    ) {}

    async execute(
        data: UpdateCustomerProfileRequest
    ): Promise<CustomerProfile & { name: string; email: string }> {
        const user = await this.userRepo.findById(data.userId);

        if (!user) {
            throw new AppError("User not found", 404);
        }

        if (data.email && data.email !== user.email) {
            const existing = await this.userRepo.findByEmail(data.email);
            if (existing && existing.id !== user.id) {
                throw new AppError("Email already in use", 409);
            }
        }

        const updatedUser = await this.userRepo.update(user.id, {
            name: data.name ?? user.name,
            email: data.email ?? user.email
        });

        if (!updatedUser) {
            throw new AppError("Unable to update user record", 500);
        }

        const updatedProfile = await this.profileRepo.updateProfile(data.userId, {
            phone: data.phone,
            address: data.address
        });

        return {
            ...updatedProfile,
            name: updatedUser.name,
            email: updatedUser.email
        };
    }
}
