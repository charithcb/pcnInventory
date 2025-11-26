export type DocumentOwner =
    | "CUSTOMER"
    | "VEHICLE"
    | "ORDER"
    | "RESERVATION";

export interface DocumentEntity {
    id?: string;

    ownerType: DocumentOwner;
    ownerId: string;

    type: string; // flexible type, e.g. "NIC", "PASSPORT", "CAR_PHOTO"

    filename: string;
    url: string;

    uploadedBy: string; // userId of uploader

    verified?: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}
