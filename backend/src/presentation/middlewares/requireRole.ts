import { Request, Response, NextFunction } from "express";
import { UserRole } from "../../domain/entities/User";

export const requireRole = (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const role = req.user.role as UserRole; // <-- FIX HERE

        if (!allowedRoles.includes(role)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        next();
    };
};

