import { NextFunction, Request, Response } from 'express';

const defaultFrontendUrl = 'http://localhost:3000';
const allowedOrigin = process.env.FRONTEND_URL || defaultFrontendUrl;

export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const requestOrigin = req.headers.origin;

    if (requestOrigin && requestOrigin === allowedOrigin) {
        res.header('Access-Control-Allow-Origin', requestOrigin);
    } else {
        res.header('Access-Control-Allow-Origin', allowedOrigin);
    }

    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
};
