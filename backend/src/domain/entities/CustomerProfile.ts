export interface Address {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
}

export interface NotificationPreferences {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
}

export interface CustomerProfile {
    id?: string;
    userId: string;
    phone?: string;
    address?: Address;
    notificationPreferences: NotificationPreferences;
    createdAt?: Date;
    updatedAt?: Date;
}
