import { NotificationPreferences } from "../../../domain/entities/CustomerProfile";
import { ICustomerProfileRepository } from "../../../domain/repositories/ICustomerProfileRepository";
import { IUserRepository } from "../../interfaces/IUserRepository";
import { AppError } from "../../../shared/errors/AppError";

interface UpdateNotificationSettingsRequest {
    userId: string;
    preferences: NotificationPreferences;
}

export class UpdateNotificationSettingsUseCase {
    constructor(
        private profileRepo: ICustomerProfileRepository,
        private userRepo: IUserRepository
    ) {}

    async execute(data: UpdateNotificationSettingsRequest) {
        const user = await this.userRepo.findById(data.userId);

        if (!user) {
            throw new AppError("User not found", 404);
        }

        return this.profileRepo.updateNotificationPreferences(
            data.userId,
            data.preferences
        );
    }
}
