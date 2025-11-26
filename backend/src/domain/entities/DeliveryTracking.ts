export interface DeliveryTracking {
    id?: string;

    orderId: string;
    vehicleId: string;
    customerId: string;

    currentStatus: TrackingStatus;

    eta?: string;                // Estimated arrival date string (optional)

    statusTimeline: {
        status: TrackingStatus;
        date: string;
        notes?: string;
        updatedBy: string;
    }[];

    createdAt?: Date;
    updatedAt?: Date;
}

export type TrackingStatus =
    | "PENDING"
    | "PURCHASED_FROM_AUCTION"
    | "ON_FREIGHT"
    | "ON_THE_WAY_TO_LOCAL_HARBOR"
    | "ARRIVED_AT_LOCAL_HARBOR"
    | "CLEARED_FROM_CUSTOMS"
    | "ARRIVED_AT_VEHICLE_YARD"
    | "READY_FOR_PICKUP";

export const TRACKING_STATUSES: TrackingStatus[] = [
    "PENDING",
    "PURCHASED_FROM_AUCTION",
    "ON_FREIGHT",
    "ON_THE_WAY_TO_LOCAL_HARBOR",
    "ARRIVED_AT_LOCAL_HARBOR",
    "CLEARED_FROM_CUSTOMS",
    "ARRIVED_AT_VEHICLE_YARD",
    "READY_FOR_PICKUP"
];
