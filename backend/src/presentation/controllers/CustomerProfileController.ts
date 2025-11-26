import { Request, Response } from "express";

import { MongoCustomerProfileRepository } from "../../infrastructure/database/repositories/MongoCustomerProfileRepository";
import { MongoUserRepository } from "../../infrastructure/database/repositories/MongoUserRepository";
import { MongoOrderRepository } from "../../infrastructure/database/repositories/MongoOrderRepository";
import { MongoDeliveryTrackingRepository } from "../../infrastructure/database/repositories/MongoDeliveryTrackingRepository";
import { MongoAppointmentRepository } from "../../infrastructure/database/repositories/MongoAppointmentRepository";
import { MongoInquiryRepository } from "../../infrastructure/database/repositories/MongoInquiryRepository";
import { MongoDocumentRepository } from "../../infrastructure/database/repositories/MongoDocumentRepository";

import { GetCustomerProfileUseCase } from "../../application/usecases/customerProfile/GetCustomerProfileUseCase";
import { UpdateCustomerProfileUseCase } from "../../application/usecases/customerProfile/UpdateCustomerProfileUseCase";
import { ChangeCustomerPasswordUseCase } from "../../application/usecases/customerProfile/ChangeCustomerPasswordUseCase";
import { GetCustomerHistoryUseCase } from "../../application/usecases/customerProfile/GetCustomerHistoryUseCase";
import { UpdateNotificationSettingsUseCase } from "../../application/usecases/customerProfile/UpdateNotificationSettingsUseCase";
import { UploadDocumentUseCase } from "../../application/usecases/document/UploadDocumentUseCase";
import { GetDocumentsByOwnerUseCase } from "../../application/usecases/document/GetDocumentsByOwnerUseCase";

const profileRepo = new MongoCustomerProfileRepository();
const userRepo = new MongoUserRepository();
const orderRepo = new MongoOrderRepository();
const deliveryRepo = new MongoDeliveryTrackingRepository();
const appointmentRepo = new MongoAppointmentRepository();
const inquiryRepo = new MongoInquiryRepository();
const documentRepo = new MongoDocumentRepository();

export class CustomerProfileController {
    static async getProfile(req: Request, res: Response) {
        try {
            const useCase = new GetCustomerProfileUseCase(profileRepo, userRepo);
            const profile = await useCase.execute(req.user!.userId);

            res.json(profile);
        } catch (error: any) {
            const status = error.statusCode || 500;
            res.status(status).json({ message: error.message });
        }
    }

    static async updateProfile(req: Request, res: Response) {
        try {
            const useCase = new UpdateCustomerProfileUseCase(profileRepo, userRepo);

            const profile = await useCase.execute({
                userId: req.user!.userId,
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address
            });

            res.json(profile);
        } catch (error: any) {
            const status = error.statusCode || 500;
            res.status(status).json({ message: error.message });
        }
    }

    static async getHistory(req: Request, res: Response) {
        try {
            const useCase = new GetCustomerHistoryUseCase(
                orderRepo,
                deliveryRepo,
                appointmentRepo,
                inquiryRepo
            );

            const history = await useCase.execute(req.user!.userId);
            res.json(history);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async changePassword(req: Request, res: Response) {
        try {
            const useCase = new ChangeCustomerPasswordUseCase(userRepo);
            await useCase.execute({
                userId: req.user!.userId,
                currentPassword: req.body.currentPassword,
                newPassword: req.body.newPassword
            });

            res.json({ message: "Password updated successfully" });
        } catch (error: any) {
            const status = error.statusCode || 500;
            res.status(status).json({ message: error.message });
        }
    }

    static async getNotificationSettings(req: Request, res: Response) {
        try {
            const useCase = new GetCustomerProfileUseCase(profileRepo, userRepo);
            const profile = await useCase.execute(req.user!.userId);

            res.json({ notificationPreferences: profile.notificationPreferences });
        } catch (error: any) {
            const status = error.statusCode || 500;
            res.status(status).json({ message: error.message });
        }
    }

    static async updateNotificationSettings(req: Request, res: Response) {
        try {
            const useCase = new UpdateNotificationSettingsUseCase(profileRepo, userRepo);
            const profile = await useCase.execute({
                userId: req.user!.userId,
                preferences: req.body.notificationPreferences
            });

            res.json(profile);
        } catch (error: any) {
            const status = error.statusCode || 500;
            res.status(status).json({ message: error.message });
        }
    }

    static async uploadDocument(req: Request, res: Response) {
        try {
            const file = req.file;

            if (!file) {
                return res.status(400).json({ message: "No file uploaded" });
            }

            const useCase = new UploadDocumentUseCase(documentRepo);
            const document = await useCase.execute({
                ownerType: "CUSTOMER",
                ownerId: req.user!.userId,
                type: req.body.type,
                filename: file.filename,
                url: `/uploads/${file.filename}`,
                uploadedBy: req.user!.userId,
                verified: false
            });

            res.status(201).json(document);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getDocuments(req: Request, res: Response) {
        try {
            const useCase = new GetDocumentsByOwnerUseCase(documentRepo);
            const docs = await useCase.execute("CUSTOMER", req.user!.userId);

            res.json(docs);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
