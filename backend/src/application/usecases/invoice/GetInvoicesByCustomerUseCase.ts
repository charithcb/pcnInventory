import { IInvoiceRepository } from "../../../domain/repositories/IInvoiceRepository";
import { Invoice } from "../../../domain/entities/Invoice";

export class GetInvoicesByCustomerUseCase {
    constructor(private invoiceRepo: IInvoiceRepository) {}

    async execute(customerId: string): Promise<Invoice[]> {
        return this.invoiceRepo.findByCustomer(customerId);
    }
}
