import { Request, Response } from "express";
import { MongoInquiryRepository } from "../../infrastructure/database/repositories/MongoInquiryRepository";
import { MongoNotificationRepository } from "../../infrastructure/database/repositories/MongoNotificationRepository";
import { CreateInquiryUseCase } from "../../application/usecases/inquiry/CreateInquiryUseCase";
import { GetMyInquiriesUseCase } from "../../application/usecases/inquiry/GetMyInquiriesUseCase";
import { GetAllInquiriesUseCase } from "../../application/usecases/inquiry/GetAllInquiriesUseCase";
import { CloseInquiryUseCase } from "../../application/usecases/inquiry/CloseInquiryUseCase";

const inquiryRepo = new MongoInquiryRepository();
const notificationRepo = new MongoNotificationRepository();

export class InquiryController {

    static async create(req: Request, res: Response) {
        try {
            const useCase = new CreateInquiryUseCase(inquiryRepo, notificationRepo);
            const inquiry = await useCase.execute({
                customerId: req.user!.userId,
                subject: req.body.subject,
                message: req.body.message,
                status: "OPEN",
            });
            res.status(201).json(inquiry);
        } catch (error) {
            res.status(400).json({ error: "Failed to create inquiry" });
        }
    }

    static async getMyInquiries(req: Request, res: Response) {
        try {
            const useCase = new GetMyInquiriesUseCase(inquiryRepo);
            const list = await useCase.execute(req.user!.userId);
            res.json(list);
        } catch (error) {
            res.status(400).json({ error: "Failed to load inquiries" });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const useCase = new GetAllInquiriesUseCase(inquiryRepo);
            const list = await useCase.execute();
            res.json(list);
        } catch (error) {
            res.status(400).json({ error: "Failed to load inquiries" });
        }
    }

    static async updateStatus(req: Request, res: Response) {
        try {
            if (req.body.status !== "CLOSED") {
                return res.status(400).json({ error: "Unsupported status update" });
            }

            const useCase = new CloseInquiryUseCase(inquiryRepo, notificationRepo);
            const updated = await useCase.execute(req.params.id, req.user!.userId);
            res.json(updated);
        } catch (error) {
            res.status(400).json({ error: "Failed to update status" });
        }
    }
}

