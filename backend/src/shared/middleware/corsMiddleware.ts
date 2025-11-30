import { NextFunction, Request, Response } from 'express';

const defaultAllowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://pcn-frontend-1:3000',
    'http://pcn-frontend-1:5173',
];

const parseAllowedOrigins = (): string[] => {
    const envOrigins = process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL;

    if (!envOrigins) {
        return defaultAllowedOrigins;
    }

    return envOrigins
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
};

export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const allowedOrigins = parseAllowedOrigins();
    const requestOrigin = req.headers.origin;

    if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
        res.header('Access-Control-Allow-Origin', requestOrigin);
    } else if (allowedOrigins.length > 0) {
        res.header('Access-Control-Allow-Origin', allowedOrigins[0]);
    }

    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
};
