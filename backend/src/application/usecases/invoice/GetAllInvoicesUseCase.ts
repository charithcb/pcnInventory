import { IInvoiceRepository } from "../../../domain/repositories/IInvoiceRepository";
import { Invoice } from "../../../domain/entities/Invoice";

export class GetAllInvoicesUseCase {
    constructor(private invoiceRepo: IInvoiceRepository) {}

    async execute(): Promise<Invoice[]> {
        return this.invoiceRepo.findAll();
    }
}
