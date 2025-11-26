import * as jwt from 'jsonwebtoken';
import { UserRole } from '../../domain/entities/User';

const JWT_SECRET: string = process.env.JWT_SECRET ?? 'dev_secret';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN ?? '1d';

export interface JwtPayload {
    userId: string;
    email: string;
    role: UserRole;
}

export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    }) as string;
};


