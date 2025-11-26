import { CustomerProfile, NotificationPreferences } from "../../../domain/entities/CustomerProfile";
import { ICustomerProfileRepository } from "../../../domain/repositories/ICustomerProfileRepository";
import { CustomerProfileModel } from "../models/CustomerProfileModel";

export class MongoCustomerProfileRepository implements ICustomerProfileRepository {
    async getByUserId(userId: string): Promise<CustomerProfile | null> {
        const profile = await CustomerProfileModel.findOne({ userId });
        return profile ? profile.toObject() : null;
    }

    async upsert(profile: CustomerProfile): Promise<CustomerProfile> {
        const updated = await CustomerProfileModel.findOneAndUpdate(
            { userId: profile.userId },
            { $set: profile },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        return updated.toObject();
    }

    async updateProfile(userId: string, data: Partial<CustomerProfile>): Promise<CustomerProfile> {
        const updated = await CustomerProfileModel.findOneAndUpdate(
            { userId },
            { $set: data },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        return updated.toObject();
    }

    async updateNotificationPreferences(
        userId: string,
        preferences: NotificationPreferences
    ): Promise<CustomerProfile> {
        const updated = await CustomerProfileModel.findOneAndUpdate(
            { userId },
            { $set: { notificationPreferences: preferences } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        return updated.toObject();
    }
}
