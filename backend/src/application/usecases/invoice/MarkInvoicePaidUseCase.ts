import { IInvoiceRepository } from "../../../domain/repositories/IInvoiceRepository";
import { Invoice } from "../../../domain/entities/Invoice";

export class MarkInvoicePaidUseCase {
    constructor(private invoiceRepo: IInvoiceRepository) {}

    async execute(id: string): Promise<Invoice | null> {
        return this.invoiceRepo.markAsPaid(id);
    }
}
