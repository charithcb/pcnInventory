import { IUserRepository } from "../../interfaces/IUserRepository";
import { AppError } from "../../../shared/errors/AppError";
import { comparePasswords, hashPassword } from "../../../shared/utils/passwordUtils";

interface ChangePasswordRequest {
    userId: string;
    currentPassword: string;
    newPassword: string;
}

export class ChangeCustomerPasswordUseCase {
    constructor(private userRepo: IUserRepository) {}

    async execute(data: ChangePasswordRequest): Promise<void> {
        const user = await this.userRepo.findById(data.userId);

        if (!user) {
            throw new AppError("User not found", 404);
        }

        const isValid = await comparePasswords(data.currentPassword, user.password);

        if (!isValid) {
            throw new AppError("Current password is incorrect", 400);
        }

        const hashed = await hashPassword(data.newPassword);

        const updated = await this.userRepo.update(user.id, { password: hashed });

        if (!updated) {
            throw new AppError("Unable to update password", 500);
        }
    }
}
