import { Request, Response } from "express";
import { MongoInvoiceRepository } from "../../infrastructure/database/repositories/MongoInvoiceRepository";
import { GenerateInvoiceUseCase } from "../../application/usecases/invoice/GenerateInvoiceUseCase";
import { GetInvoiceByIdUseCase } from "../../application/usecases/invoice/GetInvoiceByIdUseCase";
import { GetInvoicesByCustomerUseCase } from "../../application/usecases/invoice/GetInvoicesByCustomerUseCase";
import { GetInvoicesByOrderUseCase } from "../../application/usecases/invoice/GetInvoicesByOrderUseCase";
import { MarkInvoicePaidUseCase } from "../../application/usecases/invoice/MarkInvoicePaidUseCase";
import { GetAllInvoicesUseCase } from "../../application/usecases/invoice/GetAllInvoicesUseCase";

const repo = new MongoInvoiceRepository();

export class InvoiceController {

    static async generate(req: Request, res: Response) {
        const useCase = new GenerateInvoiceUseCase(repo);
        const invoice = await useCase.execute({
            orderId: req.body.orderId,
            customerId: req.body.customerId,
            issuedBy: req.user!.userId,
            items: req.body.items || [],
            subtotal: 0,
            tax: req.body.tax ?? 0,
            total: 0,
            status: 'PENDING',
            issuedAt: req.body.issuedAt,
            dueDate: req.body.dueDate
        });
        res.status(201).json(invoice);
    }

    static async getById(req: Request, res: Response) {
        const useCase = new GetInvoiceByIdUseCase(repo);
        const invoice = await useCase.execute(req.params.id);
        res.json(invoice);
    }

    static async getByOrder(req: Request, res: Response) {
        const useCase = new GetInvoicesByOrderUseCase(repo);
        const invoices = await useCase.execute(req.params.orderId);
        res.json(invoices);
    }

    static async getMyInvoices(req: Request, res: Response) {
        const useCase = new GetInvoicesByCustomerUseCase(repo);
        const invoices = await useCase.execute(req.user!.userId);
        res.json(invoices);
    }

    static async markPaid(req: Request, res: Response) {
        const useCase = new MarkInvoicePaidUseCase(repo);
        const updated = await useCase.execute(req.params.id);
        res.json(updated);
    }

    static async getAll(_req: Request, res: Response) {
        const useCase = new GetAllInvoicesUseCase(repo);
        const invoices = await useCase.execute();
        res.json(invoices);
    }
}
