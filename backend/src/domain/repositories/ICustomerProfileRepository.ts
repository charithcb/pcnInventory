import { CustomerProfile, NotificationPreferences } from "../entities/CustomerProfile";

export interface ICustomerProfileRepository {
    getByUserId(userId: string): Promise<CustomerProfile | null>;
    upsert(profile: CustomerProfile): Promise<CustomerProfile>;
    updateProfile(userId: string, data: Partial<CustomerProfile>): Promise<CustomerProfile>;
    updateNotificationPreferences(
        userId: string,
        preferences: NotificationPreferences
    ): Promise<CustomerProfile>;
}
