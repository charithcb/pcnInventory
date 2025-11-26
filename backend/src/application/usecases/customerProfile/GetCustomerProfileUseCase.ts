import { ICustomerProfileRepository } from "../../../domain/repositories/ICustomerProfileRepository";
import { IUserRepository } from "../../interfaces/IUserRepository";
import { CustomerProfile } from "../../../domain/entities/CustomerProfile";
import { AppError } from "../../../shared/errors/AppError";

export class GetCustomerProfileUseCase {
    constructor(
        private profileRepo: ICustomerProfileRepository,
        private userRepo: IUserRepository
    ) {}

    async execute(userId: string): Promise<CustomerProfile & { name: string; email: string }> {
        const user = await this.userRepo.findById(userId);

        if (!user) {
            throw new AppError("User not found", 404);
        }

        let profile = await this.profileRepo.getByUserId(userId);

        if (!profile) {
            profile = await this.profileRepo.upsert({
                userId,
                notificationPreferences: {
                    email: true,
                    sms: false,
                    push: true,
                    marketing: false
                }
            } as CustomerProfile);
        }

        return {
            ...profile,
            name: user.name,
            email: user.email
        };
    }
}
