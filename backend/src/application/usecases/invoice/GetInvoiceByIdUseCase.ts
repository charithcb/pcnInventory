import { IInvoiceRepository } from "../../../domain/repositories/IInvoiceRepository";
import { Invoice } from "../../../domain/entities/Invoice";

export class GetInvoiceByIdUseCase {
    constructor(private invoiceRepo: IInvoiceRepository) {}

    async execute(id: string): Promise<Invoice | null> {
        return this.invoiceRepo.findById(id);
    }
}
