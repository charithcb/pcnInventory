export type NotificationType =
    | 'INQUIRY_CREATED'
    | 'INQUIRY_REPLIED'
    | 'INQUIRY_CLOSED';

export interface Notification {
    id?: string;
    userId: string;         // who should see this notification
    message: string;
    type: NotificationType;
    read?: boolean;
    createdAt?: Date;
}
