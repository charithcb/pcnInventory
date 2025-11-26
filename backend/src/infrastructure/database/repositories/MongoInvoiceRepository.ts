import { IInvoiceRepository } from "../../../domain/repositories/IInvoiceRepository";
import { Invoice } from "../../../domain/entities/Invoice";
import { InvoiceModel } from "../models/InvoiceModel";

export class MongoInvoiceRepository implements IInvoiceRepository {

    async create(invoice: Invoice): Promise<Invoice> {
        const created = await InvoiceModel.create(invoice as any);
        return (created as any).toObject() as Invoice;
    }

    async findById(id: string): Promise<Invoice | null> {
        const invoice = await InvoiceModel.findById(id);
        return invoice ? (invoice.toObject() as Invoice) : null;
    }

    async findByOrder(orderId: string): Promise<Invoice[]> {
        const invoices = await InvoiceModel.find({ orderId });
        return invoices.map(i => i.toObject() as Invoice);
    }

    async findByCustomer(customerId: string): Promise<Invoice[]> {
        const invoices = await InvoiceModel.find({ customerId });
        return invoices.map(i => i.toObject() as Invoice);
    }

    async findAll(): Promise<Invoice[]> {
        const invoices = await InvoiceModel.find();
        return invoices.map(i => i.toObject() as Invoice);
    }

    async markAsPaid(id: string): Promise<Invoice | null> {
        const updated = await InvoiceModel.findByIdAndUpdate(
            id,
            { status: 'PAID' },
            { new: true }
        );
        return updated ? (updated.toObject() as Invoice) : null;
    }
}
