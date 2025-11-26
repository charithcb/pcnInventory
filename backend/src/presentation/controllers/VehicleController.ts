import { Request, Response } from 'express';

import { MongoVehicleRepository } from '../../infrastructure/database/repositories/MongoVehicleRepository';
import { CreateVehicleUseCase } from '../../application/usecases/vehicle/CreateVehicleUseCase';
import { UpdateVehicleUseCase } from '../../application/usecases/vehicle/UpdateVehicleUseCase';
import { DeleteVehicleUseCase } from '../../application/usecases/vehicle/DeleteVehicleUseCase';
import { GetVehicleByIdUseCase } from '../../application/usecases/vehicle/GetVehicleByIdUseCase';
import { GetAllVehiclesUseCase } from '../../application/usecases/vehicle/GetAllVehiclesUseCase';
import { FilterVehiclesUseCase } from '../../application/usecases/vehicle/FilterVehiclesUseCase';

export class VehicleController {

    // -------------------------------------------
    //  CREATE VEHICLE (Admin / Staff)
    // -------------------------------------------
    static async create(req: Request, res: Response) {
        try {
            const repo = new MongoVehicleRepository();
            const useCase = new CreateVehicleUseCase(repo);

            const vehicle = await useCase.execute(req.body);
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

            const updated = await useCase.execute(req.params.id, req.body);
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
    //  FILTER / SEARCH / SORT VEHICLES (Public)
    // -------------------------------------------
    static async filter(req: Request, res: Response) {
        try {
            const repo = new MongoVehicleRepository();
            const useCase = new FilterVehiclesUseCase(repo);

            // ---- BUILD QUERY OBJECT ----
            const query: any = {};

            // Exact filters
            if (req.query.make) query.make = req.query.make;
            if (req.query.model) query.model = req.query.model;
            if (req.query.color) query.color = req.query.color;
            if (req.query.status) query.status = req.query.status;

            // Year range
            if (req.query.minYear || req.query.maxYear) {
                query.year = {};
                if (req.query.minYear) query.year.$gte = Number(req.query.minYear);
                if (req.query.maxYear) query.year.$lte = Number(req.query.maxYear);
            }

            // Price range
            if (req.query.minPrice || req.query.maxPrice) {
                query.price = {};
                if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
                if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
            }

            // Mileage range
            if (req.query.minMileage || req.query.maxMileage) {
                query.mileage = {};
                if (req.query.minMileage) query.mileage.$gte = Number(req.query.minMileage);
                if (req.query.maxMileage) query.mileage.$lte = Number(req.query.maxMileage);
            }

            // Text Search (make/model)
            if (req.query.search) {
                query.$or = [
                    { make: { $regex: req.query.search, $options: 'i' } },
                    { model: { $regex: req.query.search, $options: 'i' } }
                ];
            }

            // Execute filter
            const results = await useCase.execute(query);

            // ---- SORT RESULTS ----
            let sorted = results;

            switch (req.query.sort) {
                case 'price_asc':
                    sorted = results.sort((a: any, b: any) => a.price - b.price);
                    break;
                case 'price_desc':
                    sorted = results.sort((a: any, b: any) => b.price - a.price);
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
}

