import { Invoice } from "../entities/Invoice";

export interface IInvoiceRepository {
    create(invoice: Invoice): Promise<Invoice>;
    findById(id: string): Promise<Invoice | null>;
    findByOrder(orderId: string): Promise<Invoice[]>;
    findByCustomer(customerId: string): Promise<Invoice[]>;
    findAll(): Promise<Invoice[]>;
    markAsPaid(id: string): Promise<Invoice | null>;
}
