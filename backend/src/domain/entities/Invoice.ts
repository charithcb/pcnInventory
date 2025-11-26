export interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    total?: number;
}

export type InvoiceStatus = 'PENDING' | 'PAID' | 'VOID';

export interface Invoice {
    id?: string;
    orderId: string;
    customerId: string;
    issuedBy: string;
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    total: number;
    status: InvoiceStatus;
    issuedAt?: Date;
    dueDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
