import { IInvoiceRepository } from "../../../domain/repositories/IInvoiceRepository";
import { Invoice } from "../../../domain/entities/Invoice";

export class GetInvoicesByOrderUseCase {
    constructor(private invoiceRepo: IInvoiceRepository) {}

    async execute(orderId: string): Promise<Invoice[]> {
        return this.invoiceRepo.findByOrder(orderId);
    }
}
