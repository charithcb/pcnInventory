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
    | "PURCHASED"
    | "ON_FREIGHT"
    | "ON_THE_WAY"
    | "ARRIVED_LOCAL_HARBOR"
    | "CUSTOMS_CLEARANCE"
    | "CLEARED_CUSTOMS"
    | "ARRIVED_YARD"
    | "COMPLETED";
