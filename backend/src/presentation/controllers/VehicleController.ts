import { Request, Response } from 'express';

import { MongoVehicleRepository } from '../../infrastructure/database/repositories/MongoVehicleRepository';
import { CreateVehicleUseCase } from '../../application/usecases/vehicle/CreateVehicleUseCase';
import { UpdateVehicleUseCase } from '../../application/usecases/vehicle/UpdateVehicleUseCase';
import { DeleteVehicleUseCase } from '../../application/usecases/vehicle/DeleteVehicleUseCase';
import { GetVehicleByIdUseCase } from '../../application/usecases/vehicle/GetVehicleByIdUseCase';
import { GetAllVehiclesUseCase } from '../../application/usecases/vehicle/GetAllVehiclesUseCase';
import { FilterVehiclesUseCase } from '../../application/usecases/vehicle/FilterVehiclesUseCase';
import { UpdateVehicleAvailabilityUseCase } from '../../application/usecases/vehicle/UpdateVehicleAvailabilityUseCase';
import { UpdateVehicleStockUseCase } from '../../application/usecases/vehicle/UpdateVehicleStockUseCase';
import { GetLowStockVehiclesUseCase } from '../../application/usecases/vehicle/GetLowStockVehiclesUseCase';

export class VehicleController {

    // -------------------------------------------
    //  CREATE VEHICLE (Admin / Staff)
    // -------------------------------------------
    static async create(req: Request, res: Response) {
        try {
            const repo = new MongoVehicleRepository();
            const useCase = new CreateVehicleUseCase(repo);

            const vehicle = await useCase.execute({
                ...req.body,
                lastUpdatedBy: req.user?.userId
            });
            res.status(201).json(vehicle);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    // -------------------------------------------
    //  GET ALL VEHICLES (Public)
    // -------------------------------------------
    static async getAll(req: Request, res: Response) {
        try {
            const repo = new MongoVehicleRepository();
            const useCase = new GetAllVehiclesUseCase(repo);

            const vehicles = await useCase.execute();
            res.json(vehicles);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    // -------------------------------------------
    //  GET VEHICLE BY ID (Public)
    // -------------------------------------------
    static async getById(req: Request, res: Response) {
        try {
            const repo = new MongoVehicleRepository();
            const useCase = new GetVehicleByIdUseCase(repo);

            const vehicle = await useCase.execute(req.params.id);
            res.json(vehicle);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    // -------------------------------------------
    //  UPDATE VEHICLE (Admin / Staff)
    // -------------------------------------------
    static async update(req: Request, res: Response) {
        try {
            const repo = new MongoVehicleRepository();
            const useCase = new UpdateVehicleUseCase(repo);

            const updated = await useCase.execute(req.params.id, {
                ...req.body,
                lastUpdatedBy: req.user?.userId
            });
            res.json(updated);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    // -------------------------------------------
    //  DELETE VEHICLE (Manager / Admin)
    // -------------------------------------------
    static async delete(req: Request, res: Response) {
        try {
            const repo = new MongoVehicleRepository();
            const useCase = new DeleteVehicleUseCase(repo);

            const deleted = await useCase.execute(req.params.id);
            res.json({ deleted: true });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    // -------------------------------------------
    //  UPDATE VEHICLE AVAILABILITY
    // -------------------------------------------
    static async updateAvailability(req: Request, res: Response) {
        try {
            const repo = new MongoVehicleRepository();
            const useCase = new UpdateVehicleAvailabilityUseCase(repo);

            const updated = await useCase.execute(req.params.id, req.body.status, req.user?.userId);
            res.json(updated);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    // -------------------------------------------
    //  UPDATE VEHICLE STOCK
    // -------------------------------------------
    static async updateStock(req: Request, res: Response) {
        try {
            const repo = new MongoVehicleRepository();
            const useCase = new UpdateVehicleStockUseCase(repo);

            const updated = await useCase.execute(req.params.id, Number(req.body.stock), req.user?.userId);
            res.json(updated);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    // -------------------------------------------
    //  FILTER / SEARCH / SORT VEHICLES (Public)
    // -------------------------------------------
    static async filter(req: Request, res: Response) {
        try {
            const repo = new MongoVehicleRepository();
            const useCase = new FilterVehiclesUseCase(repo);

            // ---- BUILD QUERY OBJECT ----
            const query: any = {};
            const andConditions: any[] = [];

            // Exact filters
            if (req.query.make) query.make = req.query.make;
            if (req.query.model) query.model = req.query.model;
            if (req.query.color) query.color = req.query.color;
            if (req.query.status) query.status = req.query.status;
            if (req.query.category) query.category = req.query.category;

            // Year range
            if (req.query.minYear || req.query.maxYear) {
                query.year = {};
                if (req.query.minYear) query.year.$gte = Number(req.query.minYear);
                if (req.query.maxYear) query.year.$lte = Number(req.query.maxYear);
            }

            // Price range
            if (req.query.minPrice || req.query.maxPrice) {
                const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
                const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;

                const priceCondition = {
                    $or: [
                        {
                            price: {
                                ...(minPrice !== undefined ? { $gte: minPrice } : {}),
                                ...(maxPrice !== undefined ? { $lte: maxPrice } : {}),
                            }
                        },
                        {
                            sellingPrice: {
                                ...(minPrice !== undefined ? { $gte: minPrice } : {}),
                                ...(maxPrice !== undefined ? { $lte: maxPrice } : {}),
                            }
                        }
                    ]
                };

                andConditions.push(priceCondition);
            }

            // Mileage range
            if (req.query.minMileage || req.query.maxMileage) {
                query.mileage = {};
                if (req.query.minMileage) query.mileage.$gte = Number(req.query.minMileage);
                if (req.query.maxMileage) query.mileage.$lte = Number(req.query.maxMileage);
            }

            // Text Search (make/model)
            if (req.query.search) {
                andConditions.push({
                    $or: [
                        { make: { $regex: req.query.search, $options: 'i' } },
                        { model: { $regex: req.query.search, $options: 'i' } }
                    ]
                });
            }

            if (andConditions.length > 0) {
                query.$and = andConditions;
            }

            // Execute filter
            const results = await useCase.execute(query);

            // ---- SORT RESULTS ----
            let sorted = results;

            switch (req.query.sort) {
                case 'price_asc':
                    sorted = results.sort((a: any, b: any) => (a.sellingPrice ?? a.price ?? 0) - (b.sellingPrice ?? b.price ?? 0));
                    break;
                case 'price_desc':
                    sorted = results.sort((a: any, b: any) => (b.sellingPrice ?? b.price ?? 0) - (a.sellingPrice ?? a.price ?? 0));
                    break;
                case 'year_asc':
                    sorted = results.sort((a: any, b: any) => a.year - b.year);
                    break;
                case 'year_desc':
                    sorted = results.sort((a: any, b: any) => b.year - a.year);
                    break;
            }

            res.json(sorted);

        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    // -------------------------------------------
    //  LOW STOCK ALERTS
    // -------------------------------------------
    static async lowStock(req: Request, res: Response) {
        try {
            const repo = new MongoVehicleRepository();
            const useCase = new GetLowStockVehiclesUseCase(repo);

            const threshold = req.query.threshold ? Number(req.query.threshold) : 3;
            const vehicles = await useCase.execute(threshold);
            res.json({ threshold, vehicles });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}

