import { IInvoiceRepository } from "../../../domain/repositories/IInvoiceRepository";
import { Invoice } from "../../../domain/entities/Invoice";

export class GenerateInvoiceUseCase {
    constructor(private invoiceRepo: IInvoiceRepository) {}

    async execute(data: Invoice): Promise<Invoice> {
        const items = data.items ?? [];
        const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
        const tax = data.tax ?? 0;
        const total = subtotal + tax;

        const preparedItems = items.map(item => ({
            ...item,
            total: item.quantity * item.unitPrice
        }));

        return this.invoiceRepo.create({
            ...data,
            items: preparedItems,
            subtotal,
            tax,
            total,
            status: data.status ?? 'PENDING',
            issuedAt: data.issuedAt ?? new Date()
        });
    }
}
