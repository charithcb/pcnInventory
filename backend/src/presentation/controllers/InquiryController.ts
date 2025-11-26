import { Request, Response } from "express";
import { MongoInquiryRepository } from "../../infrastructure/database/repositories/MongoInquiryRepository";
import { CreateInquiryUseCase } from "../../application/usecases/inquiry/CreateInquiryUseCase";
import { GetMyInquiriesUseCase } from "../../application/usecases/inquiry/GetMyInquiriesUseCase";
import { GetAllInquiriesUseCase } from "../../application/usecases/inquiry/GetAllInquiriesUseCase";
import { UpdateInquiryStatusUseCase } from "../../application/usecases/inquiry/UpdateInquiryStatusUseCase";

const repo = new MongoInquiryRepository();

export class InquiryController {

    static async create(req: Request, res: Response) {
        try {
            const useCase = new CreateInquiryUseCase(repo);
            const inquiry = await useCase.execute({
                customerId: req.user!.userId,
                message: req.body.message,
            });
            res.status(201).json(inquiry);
        } catch (error) {
            res.status(400).json({ error: "Failed to create inquiry" });
        }
    }

    static async getMyInquiries(req: Request, res: Response) {
        try {
            const useCase = new GetMyInquiriesUseCase(repo);
            const list = await useCase.execute(req.user!.userId);
            res.json(list);
        } catch (error) {
            res.status(400).json({ error: "Failed to load inquiries" });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const useCase = new GetAllInquiriesUseCase(repo);
            const list = await useCase.execute();
            res.json(list);
        } catch (error) {
            res.status(400).json({ error: "Failed to load inquiries" });
        }
    }

    static async updateStatus(req: Request, res: Response) {
        try {
            const useCase = new UpdateInquiryStatusUseCase(repo);
            const updated = await useCase.execute(req.params.id, req.body.status);
            res.json(updated);
        } catch (error) {
            res.status(400).json({ error: "Failed to update status" });
        }
    }
}

